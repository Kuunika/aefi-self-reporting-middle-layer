import { CacheKey, CacheTTL, Controller, Get } from '@nestjs/common';
import { VaccineTypeDto } from 'src/common/dtos/vaccine-type.dto';
import { VaccineService } from './vaccine.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('vaccines')
export class VaccineController {
	constructor(private readonly vaccineService: VaccineService) {}

	@Get()
	@CacheKey('all_vaccines')
	@CacheTTL(864_000)
	@ApiResponse({ type: [VaccineTypeDto], status: 200 })
	getAllVaccineTypes() {
		return this.vaccineService.getAllVaccineTypes();
	}
}
