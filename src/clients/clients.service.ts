import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateClientDto } from '../common/dtos/aefi-preregistry.dto';
import { Event, IDhis2TrackedEntityInstance, TrackedEntityInstance } from '../common/types';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { CLIENT_NOT_FOUND_ERROR_MESSAGE } from './constants/error-messages';
import { FindClientQueryString } from './query-strings/find-client';
import * as moment from 'moment';
import { LoggingService } from 'src/common/services/logging/logging.service';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from './schema/client.schema';
import { ClientDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ClientsService {
	constructor(
		private readonly ohspClient: OhspClientService,
		private readonly config: ConfigService,
		private readonly logger: LoggingService,
		@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
	) {}
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
		const transactionId = new Types.ObjectId().toString();
		const client = new this.clientModel();

		client.transactionId = transactionId;
		client.program = this.config.get<string>('AEFI_VACCINE_PROGRAM');
		client.programStage = this.config.get<string>('AEFI_VACCINE_STAGE');
		client.orgUnit = this.config.get<string>('AEFI_VACCINE_ORG_UNIT');
		client.firstName = payload.firstName;
		client.surname = payload.surname;
		client.phoneNumber = payload.phoneNumber;
		client.dob = moment(payload.dob).format('YYYY-MM-DD');
		client.nationalID = payload.nationalID;
		client.enrollmentDate = moment().format('YYYY-MM-DD');
		client.trackedEntityType = this.config.get<string>('ENROLMENT_TRACKED_ENTITY_TYPE');
		client.gender = payload.gender;
		client.districtOfResidence = payload.districtOfResidence;
		client.physicalAddress = payload.physicalAddress;

		await client.save();

		return {
			transactionId,
			program: this.config.get<string>('AEFI_SELF_REGISTRATION_PROGRAM'),
			programStage: this.config.get<string>('AEFI_SELF_REGISTRATION_STAGE'),
			firstName: payload.firstName,
			surname: payload.surname,
		};
	}
}
