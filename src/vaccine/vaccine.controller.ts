import { Controller, Get } from '@nestjs/common';
import { VaccineService } from './vaccine.service';

@Controller('vaccines')
export class VaccineController {
	constructor(private readonly vaccineService: VaccineService) {}

	@Get()
	getAllVaccineTypes() {
		return this.vaccineService.getAllVaccineTypes();
	}
}
