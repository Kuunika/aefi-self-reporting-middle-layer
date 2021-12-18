import { Injectable } from '@nestjs/common';
import { VaccineTypeDto } from '../common/dtos/vaccine-type.dto';

@Injectable()
export class VaccineService {
	async getAllVaccineTypes(): Promise<VaccineTypeDto[]> {
		return [
			{
				categoryOption: 'QsbEbv8qqt',
				vaccineName: 'Astrozenica',
			},
			{
				categoryOption: 'XqkXlUqYs5',
				vaccineName: 'Johnson & Johnson',
			},
			{
				categoryOption: 'RB3OEe7BEx',
				vaccineName: 'Pfizer',
			},
		];
	}
}
