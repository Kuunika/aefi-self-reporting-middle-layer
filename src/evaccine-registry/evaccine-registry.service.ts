import { Injectable } from '@nestjs/common';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { ClientFoundDto } from '../common/dtos/trackedEntityInstanceFound.dto';
import { ConfigService } from '@nestjs/config';
import { IDhis2TrackedEntityInstance, TrackedEntityInstance, Event as Dhis2Event } from '../common/types/dhis2-tracked-entity-instance';
import { DataValue } from '../common/dtos/create-new-dhis2-event.dto';
import { VaccineService } from 'src/vaccine/vaccine.service';
import { VaccineTypeDto } from 'src/common/dtos/vaccine-type.dto';
import { MultipleTrackedEntityInstancesFoundException } from '../common/exceptions/multiple-tracked-entity-instances-found';
import { NoTrackedEntityInstanceFound } from '../common/exceptions/no-tracked-entity-instance-found';

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

	vaccinationStatus(dhis2TEI: TrackedEntityInstance) {
		//filter events to get the program that is the vaccination program stage
		const vaccineProgramStage = this.configService.get<string>('AEFI_VACCINE_PROGRAM_STAGE');
		const events = dhis2TEI.enrollments[0].events.filter((event) => event.deleted === false && event.programStage === vaccineProgramStage);
		const dateOfSecondDosage = events
			.reduce((acc: DataValue[], cur) => {
				return [...acc, ...cur.dataValues];
			}, [])
			.find((value) => value.dataElement === this.configService.get<string>('AEFI_SECOND_VACCINE_DATE'))?.value;
		const nextDosageMessage = {
			1: 'Not Fully Vaccinated',
			2: 'Fully Vaccinated - Please Get a Booster Dose',
			3: 'Fully Vaccinated with Booster',
		};
		const vaccine_enum = {
			1: 'PARTIAL',
			2: 'FULLY',
			3: 'BOOSTER',
		};
		//Ugly Hack, just gets the job done for now
		let numberOfVaccineDosages = 1;
		if (events.length >= 3) {
			numberOfVaccineDosages = 3;
		} else if (events.length <= 1) {
			numberOfVaccineDosages = 1;
		} else {
			numberOfVaccineDosages = 2;
		}

		return {
			programId: events[0]?.program,
			dateOfNextDosage: numberOfVaccineDosages > 1 ? null : dateOfSecondDosage,
			nextDosageMessage: nextDosageMessage[numberOfVaccineDosages],
			vaccinationStatus: vaccine_enum[numberOfVaccineDosages],
		};
	}

	private async createTrackedEntityInstanceDto(dhis2TEI: IDhis2TrackedEntityInstance): Promise<ClientFoundDto> {
		if (dhis2TEI.trackedEntityInstances.length && dhis2TEI.trackedEntityInstances.length === 1) {
			const currentTrackedInstance = dhis2TEI.trackedEntityInstances[0];
			const epiNumber = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'Unique System Identifier (EPI)').value;
			const firstName = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'First Name').value;
			const surname = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'Last Name').value;
			const currentEnrolledEvent = this.vaccinationStatus(currentTrackedInstance);
			return {
				epiNumber,
				firstName,
				surname,
				...currentEnrolledEvent,
				trackedEntityInstance: currentTrackedInstance.trackedEntityInstance,
				orgUnit: currentTrackedInstance.orgUnit,
				program: '',
				programStage: '',
			};
		} else if (dhis2TEI.trackedEntityInstances.length > 1) {
			throw new MultipleTrackedEntityInstancesFoundException();
		} else {
			throw new NoTrackedEntityInstanceFound();
		}
	}

	async getTrackedEntityInstance(discriminator: QUERY_DISCRIMINATOR, value: string) {
		let Dhis2TrackedEntityInstance;

		if (discriminator === QUERY_DISCRIMINATOR.PHONE_NUMBER) {
			Dhis2TrackedEntityInstance = await this.ohspClient.queryTrackedEntityByPhoneNumber(value);
			const trackedEntityInstance = this.createTrackedEntityInstanceDto(Dhis2TrackedEntityInstance);
			return trackedEntityInstance;
		}

		Dhis2TrackedEntityInstance = await this.ohspClient.queryTrackedEntityByEpiNumber(value);
		return this.createTrackedEntityInstanceDto(Dhis2TrackedEntityInstance);
	}
}
