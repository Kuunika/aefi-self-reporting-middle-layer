import { Controller, Get } from '@nestjs/common';
import { AefiSignsSymptomsDto } from '../common/dtos/aefi-signs-symptoms.dto';
import { AefiService } from './aefi.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('aefis')
export class AefiController {
	constructor(private readonly aefiService: AefiService) {}

	@Get()
	@ApiResponse({ type: AefiSignsSymptomsDto, status: 200 })
	getAllAefiSignsAndSymptoms() {
		return this.aefiService.getAllAefiSignsAndSymptoms();
	}
}
