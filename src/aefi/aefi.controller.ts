import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { AefiService } from './aefi.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ReportAefiDto } from '../common/dtos/create-aefi.dto';
import { AefiSignsSymptomsDto } from './dtos';
import { AefiReportedSuccessfullyDto } from './dtos/aefi-reported-successfully.dto';

@Controller('aefis')
export class AefiController {
	constructor(private readonly aefiService: AefiService) {}

	@Get()
	@ApiResponse({ type: AefiSignsSymptomsDto, status: 200 })
	getAllAefiSignsAndSymptoms() {
		return this.aefiService.getAllAefiSignsAndSymptoms();
	}

	@Post()
	@ApiBody({ type: ReportAefiDto, description: 'Creates New Clients AEFIs Report' })
	@ApiResponse({
		type: AefiReportedSuccessfullyDto,
		status: 201,
	})
	async report(@Body() payload: ReportAefiDto): Promise<AefiReportedSuccessfullyDto> {
		try {
			const response = await this.aefiService.report(payload);
			return response;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}
