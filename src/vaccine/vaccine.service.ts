import { Injectable } from '@nestjs/common';
import { OhspClientService } from 'src/ohsp/ohsp-client.service';
import { VaccineTypeDto } from '../common/dtos/vaccine-type.dto';

@Injectable()
export class VaccineService {
	constructor(private readonly ohspClient: OhspClientService) {}

	async getAllVaccineTypes(): Promise<VaccineTypeDto[]> {
		const vaccinesfromOhsp = await this.ohspClient.getAllVaccines();

		return vaccinesfromOhsp.map((vaccine) => ({
			categoryOptionId: vaccine.id,
			vaccineName: vaccine.displayName,
		}));
	}
}
