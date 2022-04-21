import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dhis2EnrolmentAndEvent } from '../common/types/dhis2-enrolment-and-event';
import { CreateClientDto } from '../common/dtos/aefi-preregistry.dto';
import { Dhis2NewTrackedEntityInstance, Event, IDhis2TrackedEntityInstance, TrackedEntityInstance } from '../common/types';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { CLIENT_NOT_FOUND_ERROR_MESSAGE } from './constants/error-messages';
import { ClientDto } from './dtos/found-client';
//import { ClientNotFoundException } from './exceptions/client-not-found.exception';
import { FindClientQueryString } from './query-strings/find-client';
import * as moment from 'moment';
import { LoggingService } from 'src/common/services/logging/logging.service';

@Injectable()
export class ClientsService {
	constructor(private readonly ohspClient: OhspClientService, private readonly config: ConfigService, private readonly logger: LoggingService) {}
	async find({ epi_number, phone_number }: FindClientQueryString): Promise<ClientDto> {
		let trackedEntityInstance: IDhis2TrackedEntityInstance;
		//TODO: find alternative, as more discriminators are added this code will need to change.
		if (phone_number) {
			trackedEntityInstance = await this.ohspClient.queryTrackedEntityByPhoneNumber(phone_number);
		}
		if (epi_number) {
			trackedEntityInstance = await this.ohspClient.queryTrackedEntityByEpiNumber(epi_number);
		}
		if (trackedEntityInstance?.trackedEntityInstances.length) {
			try {
				const event = this.getLastVaccinationOrgUnit(trackedEntityInstance.trackedEntityInstances[0]);
				return {
					program: this.config.get<string>('AEFI_VACCINE_PROGRAM'),
					programStage: this.config.get<string>('AEFI_VACCINE_STAGE'),
					trackedEntityInstance: trackedEntityInstance.trackedEntityInstances[0].trackedEntityInstance,
					orgUnit: event.orgUnit,
					lastVaccinationDate: moment(event.eventDate).format('YYYY-MM-DD'),
					vaccineCode: event.dataValues.find((dataValue) => dataValue.dataElement === this.config.get<string>('AEFI_VACCINATION_TYPE'))
						.value,
					//TODO: What do we do when demographics are not present
					firstName: trackedEntityInstance.trackedEntityInstances[0].attributes.find((attribute) => attribute.displayName === 'First Name')
						.value,
					surname: trackedEntityInstance.trackedEntityInstances[0].attributes.find((attribute) => attribute.displayName === 'Last Name')
						.value,
				};
			} catch (error) {
				this.logger.error(`No events found for the given Record: ${epi_number}:${phone_number}`);
			}
		}
		//TODO: Find out how to do this in the controller
		throw new NotFoundException(CLIENT_NOT_FOUND_ERROR_MESSAGE);
	}

	getLastVaccinationOrgUnit(trackedEntityInstance: TrackedEntityInstance) {
		//TODO: Add fallback when events do not exist
		//TODO: The double reduce is very inefficient
		const event = trackedEntityInstance.enrollments
			.reduce((acc: Event[], enrollment) => {
				return [...acc, ...enrollment.events.filter((event) => event.program === this.config.get<string>('AEFI_VACCINE_PROGRAM'))];
			}, [])
			//TODO: find better names
			.reduce((lastRecordedEvent, current) => {
				if (new Date(current.eventDate) >= new Date(lastRecordedEvent.eventDate) && current.deleted === false) {
					return current;
				}

				return lastRecordedEvent;
			});
		return event;
	}

	async create(payload: CreateClientDto): Promise<ClientDto> {
		const ENROLMENT_TRACKED_ENTITY_TYPE = this.config.get<string>('ENROLMENT_TRACKED_ENTITY_TYPE');
		const enrolmentAndEventPayload: Dhis2EnrolmentAndEvent = {
			attributes: [
				{
					attribute: this.config.get<string>('ENROLMENT_FIRST_NAME'),
					value: payload.firstName,
				},
				{
					attribute: this.config.get<string>('ENROLMENT_SURNAME'),
					value: payload.surname,
				},
				{
					attribute: this.config.get<string>('ENROLMENT_GENDER'),
					value: payload.gender,
				},
				{
					attribute: this.config.get<string>('ENROLMENT_DOB'),
					value: moment(payload.dob).format('YYYY-MM-DD'),
				},
				{
					attribute: this.config.get<string>('ENROLMENT_PHONE_NUMBER'),
					value: payload.phoneNumber,
				},
				{
					attribute: this.config.get<string>('ENROLMENT_NATION_ID'),
					value: payload?.nationalID,
				},
				{
					attribute: this.config.get<string>('ENROLMENT_DISTRICT_OF_RESIDENCE'),
					value: payload.districtOfResidence,
				},
				{
					attribute: this.config.get<string>('ENROLMENT_PHYSICAL_ADDRESS'),
					value: payload.physicalAddress,
				},
			],
			//TODO: See how you can validate this object
			enrollments: [
				{
					enrollmentDate: moment().format('YYYY-MM-DD'),
					incidentDate: moment(payload.incidentDate).format('YYYY-MM-DD'),
					orgUnit: payload.orgUnit,
					program: this.config.get<string>('AEFI_SELF_REGISTRATION_PROGRAM'),
				},
			],
			orgUnit: payload.orgUnit,
			trackedEntityType: ENROLMENT_TRACKED_ENTITY_TYPE,
		};

		const result = await this.ohspClient.createDhis2Resource<Dhis2EnrolmentAndEvent, Dhis2NewTrackedEntityInstance>(
			'/trackedEntityInstances',
			enrolmentAndEventPayload,
		);
		return {
			trackedEntityInstance: result.response.importSummaries[0].reference,
			program: this.config.get<string>('AEFI_SELF_REGISTRATION_PROGRAM'),
			programStage: this.config.get<string>('AEFI_SELF_REGISTRATION_STAGE'),
			firstName: payload.firstName,
			surname: payload.surname,
		};
	}
}
