import { Injectable } from '@nestjs/common';
import { Dhis2EnrolmentAndEvent } from '../common/types/dhis2-enrolment-and-event';
import { AefiPreregistrationDto } from '../common/dtos/aefi-preregistry.dto';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';

@Injectable()
export class VaccinePreregistrationService {
	constructor(private readonly ohspClient: OhspClientService, private readonly config: ConfigService) {}

	async createVaccinePreregistrationSelfReporting(payload: AefiPreregistrationDto) {
		const ENROLMENT_TRACKED_ENTITY_TYPE = this.config.get<string>('ENROLMENT_TRACKED_ENTITY_TYPE');
		const AEFI_SEVERITY = this.config.get<string>('AEFI_SEVERITY');
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
					value: payload.dob,
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
			enrolments: [
				{
					enrolmentDate: moment().format('YYYY-MM-DD'),
					incidentDate: payload.vaccination.dateOfVaccination,
					orgUnit: payload.aefiSignsAndSymptoms.orgUnitId,
					program: this.config.get<string>('AEFI_SELF_REGISTRATION_PROGRAM'),
					events: [
						{
							program: this.config.get<string>('AEFI_SELF_REGISTRATION_PROGRAM'),
							orgUnit: payload.aefiSignsAndSymptoms.orgUnitId,
							eventDate: payload.vaccination.dateOfVaccination,
							status: 'COMPLETED',
							storedBy: this.config.get<string>('AEFI_STORED_BY'),
							programStage: 'AQP9OJtKs8o',
							dataValues: [
								...payload.aefiSignsAndSymptoms.aefiSideEffects,
								{ dataElement: AEFI_SEVERITY, value: payload.aefiSignsAndSymptoms.aefiSeverityId },
							],
						},
					],
				},
			],
			orgUnit: payload.aefiSignsAndSymptoms.orgUnitId,
			trackedEntityType: ENROLMENT_TRACKED_ENTITY_TYPE,
		};
		try {
			return this.ohspClient.createDhis2Resource('/trackedEntityInstances', enrolmentAndEventPayload);
		} catch (err) {
			console.log(err);
		}
	}
}
