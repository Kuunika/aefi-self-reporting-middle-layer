import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { ReportAefiDto } from '../common/dtos/create-aefi.dto';
import { TrackedEntityInstanceFoundDto } from '../common/dtos/trackedEntityInstanceFound.dto';
import { ConfigService } from '@nestjs/config';
import { IDhis2TrackedEntityInstance, TrackedEntityInstance, Event as Dhis2Event } from '../common/types/dhis2-tracked-entity-instance';
import { CreateNewDhis2EventDto, DataValue } from '../common/dtos/create-new-dhis2-event.dto';
import moment from 'moment';
import { VaccineService } from 'src/vaccine/vaccine.service';
import { VaccineTypeDto } from 'src/common/dtos/vaccine-type.dto';
import { DHIS2Status } from 'src/ohsp/enums/status';

export enum QUERY_DISCRIMINATOR {
	PHONE_NUMBER,
	EPI_NUMBER,
}

@Injectable()
export class EvaccineRegistryService {
	constructor(
		private readonly ohspClient: OhspClientService,
		private readonly configService: ConfigService,
		private readonly vaccineService: VaccineService,
	) {}

	private async getCurrentEnrolledEvent(dhis2TEI: TrackedEntityInstance) {
		const AEFI_SECOND_VACCINE_DATE = this.configService.get<string>('AEFI_SECOND_VACCINE_DATE');

		// Loops through russian doll DHIS2 object to get the desired program stored in the event
		const enrollments = dhis2TEI.enrollments;
		// Assumption is there will only be one instance of Events in the enrolments array
		//TODO: Add error handling in case of no events found on the person.
		const dhis2Events = enrollments[0].events;
		const event = this.getProgram(dhis2Events);
		const vaccines = await this.vaccineService.getAllVaccineTypes();
		this.getSecondDosageDate(event, vaccines);
		return {
			programId: event?.program,
			dateOfSecondDosage: event?.dataValues?.find((value) => value?.dataElement === AEFI_SECOND_VACCINE_DATE)?.value ?? '',
		};
	}

	// filter enrolments where deleted is eq to false
	// from any of the events get the vaccine name that was used
	// if number of events are less than their respective vaccination type return second vaccination date
	// if the number is eq to, return fully 'Fully Vaccinated'.

	private async getProgramAndDosageReminder(dhis2TEI: TrackedEntityInstance) {
		const AEFI_VACCINE_PROGRAM = this.configService.get<string>('AEFI_VACCINE_PROGRAM');
		const AEFI_VACCINATION_TYPE = this.configService.get<string>('AEFI_VACCINATION_TYPE');
		const AEFI_SECOND_VACCINE_DATE = this.configService.get<string>('AEFI_SECOND_VACCINE_DATE');

		const events = dhis2TEI.enrollments[0].events.filter((event) => event.deleted === false);
		const vaccineName = events
			.find((event) => event.program === AEFI_VACCINE_PROGRAM)
			?.dataValues?.find((value) => value.dataElement === AEFI_VACCINATION_TYPE)?.value;
		const vaccines = await this.vaccineService.getAllVaccineTypes();

		const numberOfVaccineDosages = vaccines.find((vaccine) => vaccine.vaccineName.toLowerCase() === vaccineName).numberOfDosages;
		const dateOfSecondDosage = events
			.reduce((acc: DataValue[], cur) => {
				return [...acc, ...cur.dataValues];
			}, [])
			.find((value) => value.dataElement === AEFI_SECOND_VACCINE_DATE)?.value;
		const isFullyVaccinated = events.length >= numberOfVaccineDosages;
		return {
			programId: events[0]?.program,
			dateOfNextDosage: isFullyVaccinated ? null : dateOfSecondDosage,
			nextDosageMessage: isFullyVaccinated ? 'Fully Vaccinated' : 'Not Fully Vaccinated',
		};
	}

	private getSecondDosageDate(event: Dhis2Event, vaccines: VaccineTypeDto[]) {}

	private getProgram(dhis2Events: Dhis2Event[]): Dhis2Event {
		const AEFI_VACCINE_PROGRAM = this.configService.get<string>('AEFI_VACCINE_PROGRAM');
		const AEFI_FIRST_VACCINE = this.configService.get<string>('AEFI_FIRST_VACCINE');
		const AEFI_SELF_REGISTRATION_PROGRAM = this.configService.get<string>('AEFI_SELF_REGISTRATION_PROGRAM');

		const vaccineRegistry = dhis2Events.find(
			(event) => event.program === AEFI_VACCINE_PROGRAM && event.dataValues.find((dataValue) => dataValue.value === AEFI_FIRST_VACCINE),
		);

		const selfRegistry = dhis2Events.find((event) => event.program === AEFI_SELF_REGISTRATION_PROGRAM);

		return vaccineRegistry ? vaccineRegistry : selfRegistry;
	}

	private async createTrackedEntityInstanceDto(dhis2TEI: IDhis2TrackedEntityInstance): Promise<TrackedEntityInstanceFoundDto> {
		if (dhis2TEI.trackedEntityInstances.length) {
			const currentTrackedInstance = dhis2TEI.trackedEntityInstances[0];
			const epiNumber = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'Unique System Identifier (EPI)').value;
			const firstName = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'First Name').value;
			const lastName = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'Last Name').value;
			const currentEnrolledEvent = await this.getProgramAndDosageReminder(currentTrackedInstance);
			return {
				epiNumber,
				firstName,
				lastName,
				...currentEnrolledEvent,
				trackedEntityInstanceId: currentTrackedInstance.trackedEntityInstance,
				orgUnitId: currentTrackedInstance.orgUnit,
			};
		}
		return null;
	}

	async createVaccineEvent(createAefiDto: ReportAefiDto) {
		const AEFI_SEVERITY = this.configService.get<string>('AEFI_SEVERITY');
		const trackedEntityInstance = createAefiDto.trackedEntityInstance;
		const payload: CreateNewDhis2EventDto = {
			program: createAefiDto.program,
			programStage: createAefiDto.programStage,
			trackedEntityInstance,
			orgUnit: createAefiDto.orgUnit,
			eventDate: moment().format('YYYY-MM-DD'),
			status: DHIS2Status.COMPLETED,
			completedDate: moment().format('YYYY-MM-DD'),
			dataValues: [
				...createAefiDto.aefiSideEffects.map((dataElement) => ({ dataElement, value: 'True' })),
				{ dataElement: AEFI_SEVERITY, value: createAefiDto.aefiSeverityId },
			],
		};

		try {
			this.ohspClient.createDhis2Resource('/', payload);
			return true;
		} catch (error) {
			throw new ServiceUnavailableException();
		}
	}

	async getTrackedEntityInstance(discriminator: QUERY_DISCRIMINATOR, value: string) {
		let Dhis2TrackedEntityInstance;
		if (discriminator === QUERY_DISCRIMINATOR.PHONE_NUMBER) {
			Dhis2TrackedEntityInstance = await this.ohspClient.queryTrackedEntityByPhoneNumber(value);

			return this.createTrackedEntityInstanceDto(Dhis2TrackedEntityInstance);
		}

		Dhis2TrackedEntityInstance = await this.ohspClient.queryTrackedEntityByEpiNumber(value);
		return this.createTrackedEntityInstanceDto(Dhis2TrackedEntityInstance);
	}
}
