import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Dhis2Constant, Dhis2Constants } from '../common/types';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { VaccineTypeDto } from '../common/dtos/vaccine-type.dto';
import { Cache } from 'cache-manager';
import { DosageInformation } from './interface/dosage-information';
import { VACCINE_DOSAGES, VACCINE_TYPES } from 'src/common/constants';

@Injectable()
export class VaccineService {
	constructor(private readonly ohspClient: OhspClientService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async getAllVaccineTypes(): Promise<VaccineTypeDto[]> {
		const fromCache = await this.cacheManager.get<VaccineTypeDto[]>(VACCINE_TYPES);

		if (fromCache) {
			return fromCache;
		}

		const vaccinesFromOhsp = await this.ohspClient.getAllVaccines();
		const vaccineDosages = await this.getDosageInformation();

		const vaccineTypes = vaccinesFromOhsp.map((vaccine) => ({
			categoryOptionId: vaccine.id,
			vaccineName: vaccine.displayName,
			vaccineCode: vaccine.code,
			//TODO: Matching is a little brittle, consider replacing with a regex.
			numberOfDosages: vaccineDosages.find((dosageInfo) => dosageInfo.name.includes(vaccine.displayName) && dosageInfo.numberOfDoses < 10)
				?.numberOfDoses,
		}));

		this.cacheManager.set(VACCINE_TYPES, vaccineTypes, { ttl: 40_000 });
		return vaccineTypes;
	}

	private async getDosageInformation(): Promise<DosageInformation[]> {
		const fromCache = await this.cacheManager.get<DosageInformation[]>(VACCINE_DOSAGES);
		if (fromCache) {
			return fromCache;
		}
		const allConstantsFromDhis2 = await this.ohspClient.getDhis2Resource<Dhis2Constants>('/constants.json');
		const dosageInformationFromDhis2 = await Promise.all(
			allConstantsFromDhis2.constants.map((constant) => this.ohspClient.getDhis2Resource<Dhis2Constant>(`/constants/${constant.id}.json`)),
		);

		const vaccineDosages = dosageInformationFromDhis2.map((dosage) => ({
			name: dosage.displayFormName,
			numberOfDoses: Math.floor(dosage.value),
		}));

		this.cacheManager.set(VACCINE_DOSAGES, vaccineDosages, { ttl: 40_000 });
		return vaccineDosages;
	}
}
