import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NewClientDto } from '../common/dtos/new-client.dto';
import { DataValue, IDhis2TrackedEntityInstance, TrackedEntityInstance } from '../common/types';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { FindClientQueryString } from './query-strings/find-client';
import * as moment from 'moment';
import { LoggingService } from 'src/common/services/logging/logging.service';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from './schema/client.schema';
import { CreateClientDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { MultipleTrackedEntityInstancesFoundException } from 'src/common/exceptions/multiple-tracked-entity-instances-found';
import { NoTrackedEntityInstanceFound } from 'src/common/exceptions/no-tracked-entity-instance-found';
import { ClientFoundDto } from 'src/common/dtos/trackedEntityInstanceFound.dto';

@Injectable()
export class ClientsService {
	constructor(
		private readonly ohspClient: OhspClientService,
		private readonly config: ConfigService,
		private readonly configService: ConfigService,
		@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
	) {}

	async find({ epi_number, phone_number }: FindClientQueryString) {
		let trackedEntityInstance: IDhis2TrackedEntityInstance;
		//TODO: find alternative, as more discriminators are added this code will need to change.
		if (phone_number) {
			trackedEntityInstance = await this.ohspClient.queryTrackedEntityByPhoneNumber(phone_number);
		}
		if (epi_number) {
			trackedEntityInstance = await this.ohspClient.queryTrackedEntityByEpiNumber(epi_number);
		}
		if (trackedEntityInstance) {
			return this.parseIntoTrackedEntityInstanceDto(trackedEntityInstance);
		}
		throw new NoTrackedEntityInstanceFound();
	}

	async create(payload: CreateClientDto): Promise<NewClientDto> {
		const transactionId = new Types.ObjectId().toString();
		const client = new this.clientModel();

		client.transactionId = transactionId;
		client.program = this.config.get<string>('AEFI_VACCINE_PROGRAM');
		client.programStage = this.config.get<string>('AEFI_VACCINE_STAGE');
		client.orgUnit = payload.orgUnit;
		client.firstName = payload?.firstName;
		client.surname = payload?.surname;
		client.phoneNumber = payload?.phoneNumber;
		client.dob = moment(payload?.dob).format('YYYY-MM-DD');
		client.nationalID = payload?.nationalID;
		client.incidentDate = payload?.incidentDate;
		client.enrollmentDate = moment().format('YYYY-MM-DD');
		client.trackedEntityType = this.config.get<string>('ENROLMENT_TRACKED_ENTITY_TYPE');
		client.gender = payload?.gender;
		client.districtOfResidence = payload?.districtOfResidence;
		client.physicalAddress = payload?.physicalAddress;
		client.vaccineCode = payload?.vaccineCode;

		await client.save();

		return {
			program: client.program,
			programStage: client.programStage,
			enrollmentDate: client.enrollmentDate,
			transactionId,
			...payload,
		};
	}

	private parseIntoTrackedEntityInstanceDto(dhis2TEI: IDhis2TrackedEntityInstance): ClientFoundDto {
		if (dhis2TEI.trackedEntityInstances.length && dhis2TEI.trackedEntityInstances.length === 1) {
			const currentTrackedInstance = dhis2TEI.trackedEntityInstances[0];
			const epiNumber = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'Unique System Identifier (EPI)').value;
			const firstName = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'First Name').value;
			const surname = currentTrackedInstance.attributes.find((attribute) => attribute.displayName === 'Last Name').value;
			const currentEnrolledEvent = this.getVaccinationStatus(currentTrackedInstance);
			return {
				trackedEntityInstance: currentTrackedInstance.trackedEntityInstance,
				orgUnit: currentTrackedInstance.orgUnit,
				epiNumber,
				firstName,
				surname,
				...currentEnrolledEvent,
			};
		} else if (dhis2TEI.trackedEntityInstances.length > 1) {
			throw new MultipleTrackedEntityInstancesFoundException();
		} else {
			throw new NoTrackedEntityInstanceFound();
		}
	}

	private getVaccinationStatus(dhis2TEI: TrackedEntityInstance) {
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
			program: events[0].program,
			programStage: events[0].programStage,
			dateOfNextDosage: numberOfVaccineDosages > 1 ? null : moment(dateOfSecondDosage).format('YYYY-MM-DD'),
			nextDosageMessage: nextDosageMessage[numberOfVaccineDosages] as string,
			vaccinationStatus: vaccine_enum[numberOfVaccineDosages] as string,
		};
	}
}
