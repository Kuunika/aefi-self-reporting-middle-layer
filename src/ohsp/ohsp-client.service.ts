import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { OrgUnit } from '../common/types/dhis2-org-unit';
import { IDhis2TrackedEntityInstance } from '../common/types/dhis2-tracked-entity-instance';

@Injectable()
export class OhspClientService {
	constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

	async queryTrackedEntityByPhoneNumber(phoneNumber: string) {
		const AEFI_VACCINES_OU = this.configService.get('AEFI_VACCINES_OU');
		const AEFI_VACCINES_OU_MODE = this.configService.get('AEFI_VACCINES_OU_MODE');
		const AEFI_PHONE_NUMBER = this.configService.get('AEFI_PHONE_NUMBER');

		const request = this.httpService.get<IDhis2TrackedEntityInstance>(
			`/trackedEntityInstances.json?ou=${AEFI_VACCINES_OU}&ouMode=${AEFI_VACCINES_OU_MODE}&filter=${AEFI_PHONE_NUMBER}:EQ:${phoneNumber}&fields=enrollments[events],attributes`,
		);
		const response = await lastValueFrom(request);
		return response.data;
	}

	async queryTrackedEntityByEpiNumber(epiNumber: string) {
		const AEFI_VACCINES_OU = this.configService.get('AEFI_VACCINES_OU');
		const AEFI_VACCINES_OU_MODE = this.configService.get('AEFI_VACCINES_OU_MODE');
		const AEFI_EPI_NUMBER_FILTER = this.configService.get('AEFI_EPI_NUMBER_FILTER');

		const request = this.httpService.get<IDhis2TrackedEntityInstance>(
			`/trackedEntityInstances.json?ou=${AEFI_VACCINES_OU}&ouMode=${AEFI_VACCINES_OU_MODE}&filter=${AEFI_EPI_NUMBER_FILTER}:EQ:${epiNumber}&fields=enrollments[events],attributes`,
		);
		const response = await lastValueFrom(request);
		return response.data;
	}

	async getAllOrganisationalUnits() {
		const request = this.httpService.get<OrgUnit>('/organisationUnits.json?&paging=false');
		const response = await lastValueFrom(request);
		return response.data.organisationUnits.map((org) => ({ displayName: org.displayName, orgUnitId: org.id }));
	}
}
