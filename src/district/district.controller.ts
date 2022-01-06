import { Controller, Get } from '@nestjs/common';
import { DistrictService } from './district.service';

@Controller('districts')
export class DistrictController {
	constructor(private readonly districtService: DistrictService) {}

	@Get()
	getAllDistricts() {}
}
