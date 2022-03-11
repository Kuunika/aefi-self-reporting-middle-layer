import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DistrictsDto } from '../common/dtos/districts.dto';
import { DistrictService } from './district.service';

@Controller('districts')
export class DistrictController {
	constructor(private readonly districtService: DistrictService) {}

	@Get()
	@ApiResponse({ type: DistrictsDto, status: 200 })
	getAllDistricts() {
		return this.districtService.getAllDistricts();
	}
}
