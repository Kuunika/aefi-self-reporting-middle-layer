import { HttpService } from '@nestjs/axios';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { CreateNewDhis2EventDto } from '../common/dtos/create-new-dhis2-event.dto';
import { ReportAefiDto } from '../common/dtos/create-aefi.dto';
import { Dhis2Option, Dhis2OptionSet, OrgUnit, IDhis2TrackedEntityInstance, Dhis2DataElement } from '../common/types';
import * as moment from 'moment';
@Injectable()
export class OhspClientService {
	constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

	//TODO: Duplication and Ugly, Please Change
	async queryTrackedEntityByPhoneNumber(phoneNumber: string) {
		const AEFI_VACCINES_OU = this.configService.get('AEFI_VACCINES_OU');
		const AEFI_VACCINES_OU_MODE = this.configService.get('AEFI_VACCINES_OU_MODE');
		const AEFI_PHONE_NUMBER = this.configService.get('AEFI_PHONE_NUMBER');

		const request = this.httpService.get<IDhis2TrackedEntityInstance>(
			`/trackedEntityInstances.json?ou=${AEFI_VACCINES_OU}&ouMode=${AEFI_VACCINES_OU_MODE}&filter=${AEFI_PHONE_NUMBER}:EQ:${phoneNumber}&fields=enrollments[events],attributes,orgUnit,trackedEntityInstance`,
		);
		const response = await lastValueFrom(request);
		return response.data;
	}

	async queryTrackedEntityByEpiNumber(epiNumber: string) {
		const AEFI_VACCINES_OU = this.configService.get('AEFI_VACCINES_OU');
		const AEFI_VACCINES_OU_MODE = this.configService.get('AEFI_VACCINES_OU_MODE');
		const AEFI_EPI_NUMBER_FILTER = this.configService.get('AEFI_EPI_NUMBER_FILTER');

		const request = this.httpService.get<IDhis2TrackedEntityInstance>(
			`/trackedEntityInstances.json?ou=${AEFI_VACCINES_OU}&ouMode=${AEFI_VACCINES_OU_MODE}&filter=${AEFI_EPI_NUMBER_FILTER}:EQ:${epiNumber}&fields=enrollments[events],attributes,orgUnit,trackedEntityInstance`,
		);
		const response = await lastValueFrom(request);
		return response.data;
	}

	async getAllOrganisationalUnits() {
		const request = this.httpService.get<OrgUnit>('/organisationUnits.json?&paging=false');
		const response = await lastValueFrom(request);
		return response.data.organisationUnits.map((org) => ({ displayName: org.displayName, orgUnitId: org.id }));
	}

	async getAllVaccines() {
		const AEFI_VACCINE_DHIS_OPTIONS = this.configService.get('AEFI_VACCINE_DHIS_OPTIONS');
		const request = this.httpService.get<Dhis2OptionSet>(`/optionSets/${AEFI_VACCINE_DHIS_OPTIONS}.json`);
		const response = await lastValueFrom(request);
		const vaccineIds = response.data.options;
		return Promise.all(vaccineIds.map((vaccine) => this.getVaccineName(vaccine.id)));
	}
	private async getVaccineName(vaccineId: string) {
		const request = this.httpService.get<Dhis2Option>(`/options/${vaccineId}.json`);
		const response = await lastValueFrom(request);
		return response.data;
	}
	async getOptionsSetValues(optionSetId: string) {
		const request = this.httpService.get<Dhis2OptionSet>(`/optionSets/${optionSetId}.json`);
		const response = await lastValueFrom(request);
		return response.data;
	}

	async getOption(optionId: string) {
		const request = this.httpService.get<Dhis2Option>(`/options/${optionId}.json`);
		const response = await lastValueFrom(request);
		return response.data;
	}

	async getDhis2Resource<T>(url: string) {
		try {
			const request = await this.httpService.get<T>(url);
			const response = await lastValueFrom(request);
			return response.data;
		} catch (error) {
			throw new ServiceUnavailableException();
		}
	}

	async createDhis2Resource<Payload, Return>(url: string, payload: Payload): Promise<Return> {
		//TODO: provide the error report summery in the debug
		try {
			const request = await this.httpService.post<Return>(url, payload);
			const response = await lastValueFrom(request);
			return response.data;
		} catch (err) {
			throw new ServiceUnavailableException();
		}
	}
}
