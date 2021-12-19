import { Injectable } from '@nestjs/common';
import { ServerUnavailableException } from '../common/exceptions';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { CreateAefiDto } from '../common/dtos/create-aefi.dto';
import { TrackedEntityInstanceFoundDto } from '../common/dtos/trackedEntityInstanceFound.dto';
import { ConfigService } from '@nestjs/config';
import { IDhis2TrackedEntityInstance, TrackedEntityInstance, Event as Dhis2Event } from '../common/types/dhis2-tracked-entity-instance';

export enum QUERY_DISCRIMINATOR {
	PHONE_NUMBER,
	EPI_NUMBER,
}

@Injectable()
export class EvaccineRegistryService {
	constructor(private readonly ohspClient: OhspClientService, private readonly configService: ConfigService) {}

	private getCurrentEnrolledEvent(dhis2TEI: TrackedEntityInstance) {
		const AEFI_SECOND_VACCINE_DATE = this.configService.get<string>('AEFI_SECOND_VACCINE_DATE');

		// Loops through russian doll DHIS2 object to get the desired program stored in the event
		const enrollments = dhis2TEI.enrollments;
		// Assumption is there will only be one instance of Events in the enrolments array
		const dhis2Events = enrollments[0].events;
		const event = this.getProgram(dhis2Events);

		return {
			programId: event?.program,
			trackedEntityInstanceId: event?.trackedEntityInstance,
			dateOfSecondDosage: event?.dataValues?.find((value) => value?.dataElement === AEFI_SECOND_VACCINE_DATE)?.value ?? '',
		};
	}

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

	private createTrackedEntityInstanceDto(dhis2TEI: IDhis2TrackedEntityInstance): TrackedEntityInstanceFoundDto {
		if (dhis2TEI.trackedEntityInstances.length) {
			const currentTrackedInstance = dhis2TEI.trackedEntityInstances[0];
			const epiNumber = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'Unique System Identifier (EPI)').value;
			const firstName = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'First Name').value;
			const lastName = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'Last Name').value;
			return {
				epiNumber,
				firstName,
				lastName,
				...this.getCurrentEnrolledEvent(currentTrackedInstance),
			};
		}
		return null;
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

	async createTrackedEntityInstanceSideEffectsRecord(epiNo: string, payload: CreateAefiDto) {
		return true;
	}
}
