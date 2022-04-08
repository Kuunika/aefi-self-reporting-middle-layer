import { Injectable } from '@nestjs/common';
import { Dhis2Constant, Dhis2Constants } from '../common/types';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { VaccineTypeDto } from '../common/dtos/vaccine-type.dto';

@Injectable()
export class VaccineService {
	constructor(private readonly ohspClient: OhspClientService) {}

	async getAllVaccineTypes(): Promise<VaccineTypeDto[]> {
		const vaccinesFromOhsp = await this.ohspClient.getAllVaccines();
		const vaccineDosages = await this.getDosageInformation();

		return vaccinesFromOhsp.map((vaccine) => ({
			categoryOptionId: vaccine.id,
			vaccineName: vaccine.displayName,
			//TODO: Matching is a little brittle, consider replacing with a regex.
			numberOfDosages: vaccineDosages.find((dosageInfo) => dosageInfo.name.includes(vaccine.displayName) && dosageInfo.numberOfDoses < 10)
				?.numberOfDoses,
		}));
	}

	private async getDosageInformation() {
		const allConstantsFromDhis2 = await this.ohspClient.getDhis2Resource<Dhis2Constants>('/constants.json');
		const dosageInformationFromDhis2 = await Promise.all(
			allConstantsFromDhis2.constants.map((constant) => this.ohspClient.getDhis2Resource<Dhis2Constant>(`/constants/${constant.id}.json`)),
		);

		return dosageInformationFromDhis2.map((dosage) => ({
			name: dosage.displayFormName,
			numberOfDoses: Math.floor(dosage.value),
		}));
	}
}
