import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { Dhis2Option, Dhis2OptionSet, OrgUnit, IDhis2TrackedEntityInstance } from '../common/types';
import { AxiosError } from 'axios';
import { Dhis2Error } from 'src/common/types/dhis2-error';
import { LoggingService } from 'src/common/services/logging/logging.service';
@Injectable()
export class OhspClientService {
	constructor(private readonly httpService: HttpService, private readonly configService: ConfigService, private readonly log: LoggingService) {}

	//TODO: Duplication and Ugly, Please Change
	async queryTrackedEntityByPhoneNumber(phoneNumber: string) {
		const AEFI_VACCINES_OU = this.configService.get('AEFI_VACCINES_OU');
		const AEFI_VACCINES_OU_MODE = this.configService.get('AEFI_VACCINES_OU_MODE');
		const AEFI_PHONE_NUMBER = this.configService.get('AEFI_PHONE_NUMBER');
		const AEFI_PROGRAM = this.configService.get('AEFI_PROGRAM');
		try {
			const request = this.httpService.get<IDhis2TrackedEntityInstance>(
				`/trackedEntityInstances.json?program=${AEFI_PROGRAM}&ou=${AEFI_VACCINES_OU}&ouMode=${AEFI_VACCINES_OU_MODE}&filter=${AEFI_PHONE_NUMBER}:EQ:${phoneNumber}&fields=enrollments[events],attributes,orgUnit,trackedEntityInstance`,
			);
			const response = await lastValueFrom(request);
			return response.data;
		} catch (error) {
			console.error(error);
			console.error('Failed to find the Tracked Entity Instance' + error.message);
			return null;
		}
	}

	async queryTrackedEntityByEpiNumber(epiNumber: string) {
		const AEFI_VACCINES_OU = this.configService.get('AEFI_VACCINES_OU');
		const AEFI_VACCINES_OU_MODE = this.configService.get('AEFI_VACCINES_OU_MODE');
		const AEFI_EPI_NUMBER_FILTER = this.configService.get('AEFI_EPI_NUMBER_FILTER');
		const AEFI_PROGRAM = this.configService.get('AEFI_PROGRAM');
		try {
			const request = this.httpService.get<IDhis2TrackedEntityInstance>(
				`/trackedEntityInstances.json?program=${AEFI_PROGRAM}&ou=${AEFI_VACCINES_OU}&ouMode=${AEFI_VACCINES_OU_MODE}&filter=${AEFI_EPI_NUMBER_FILTER}:EQ:${epiNumber}&fields=enrollments[events],attributes,orgUnit,trackedEntityInstance`,
			);
			const response = await lastValueFrom(request);

			return response.data;
		} catch (error) {
			console.error(error);
			console.error('Failed to find the Tracked Entity Instance' + error.message);
			return null;
		}
	}

	async getAllOrganisationalUnits() {
		const request = this.httpService.get<OrgUnit>('/organisationUnits.json?&paging=false');
		const response = await lastValueFrom(request);
		return response.data.organisationUnits.map((org) => ({ displayName: org.displayName, orgUnitId: org.id }));
	}

	async getAllVaccines() {
		const AEFI_VACCINE_DHIS_OPTIONS = this.configService.get('AEFI_VACCINE_OPTIONS_SET');
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

	async findDhis2Resource<Return>(url): Promise<Return> {
		try {
			const request = await this.httpService.get<Return>(url);
			const response = await lastValueFrom(request);
			return response.data;
		} catch (err) {
			const error = err as AxiosError;
			if (error.response.status === 400 || error.response.status === 409) {
				this.log.error(`There is an issue with the URL: ${error.config.baseURL}/${url}`);
			}
			if (error.response.status === 404) {
				this.log.error(`Resource Not Found URL: ${url}`);
			}
			if (error.response.status >= 500) {
				this.log.error(`OHSP is unavailable`);
			}
			throw new InternalServerErrorException();
		}
	}

	async createDhis2Resource<Payload, Return>(url: string, payload: Payload): Promise<Return> {
		try {
			const request = await this.httpService.post<Return>(url, payload);
			const response = await lastValueFrom(request);
			return response.data;
		} catch (err) {
			const error = err as AxiosError;
			const dhis2Error = error.response.data as Dhis2Error;

			if (dhis2Error.httpStatusCode === 409) {
				const description = dhis2Error.response.importSummaries[0].description;
				const conflicts = dhis2Error.response.importSummaries[0].conflicts.reduce((acc: string, cur) => `${acc} ${cur.value}`, '');
				this.log.error(`${new Date()}: Conflicts when Trying to Create Record in OHSP - ${description} ${conflicts}`);
			}
			throw new InternalServerErrorException();
		}
	}
}
