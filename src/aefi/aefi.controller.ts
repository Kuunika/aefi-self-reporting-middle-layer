import { Body, Controller, Get, Post } from '@nestjs/common';
import { AefiService } from './aefi.service';
import { ApiResponse } from '@nestjs/swagger';
import { ReportAefiDto } from '../common/dtos/create-aefi.dto';
import { CreatedAefiDto, AefiSignsSymptomsDto } from './dtos';

@Controller('aefis')
export class AefiController {
	constructor(private readonly aefiService: AefiService) {}

	@Get()
	@ApiResponse({ type: AefiSignsSymptomsDto, status: 200 })
	getAllAefiSignsAndSymptoms() {
		return this.aefiService.getAllAefiSignsAndSymptoms();
	}

	@Post()
	@ApiResponse({ type: CreatedAefiDto, status: 201 })
	report(@Body() payload: ReportAefiDto) {
		return this.aefiService.report(payload);
	}
}
