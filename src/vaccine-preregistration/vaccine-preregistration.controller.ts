import { Body, Controller, Post } from '@nestjs/common';
import { AefiPreregistrationDto } from '../common/dtos/aefi-preregistry.dto';
import { ApiBody } from '@nestjs/swagger';
import { VaccinePreregistrationService } from './vaccine-preregistration.service';

@Controller('vaccine-preregistrations')
export class VaccinePreregistrationController {
	constructor(private readonly vaccinePreregistrationService: VaccinePreregistrationService) {}

	@Post()
	@ApiBody({ type: AefiPreregistrationDto, description: 'Sample Description' })
	async createAefiVaccinePreregistration(@Body() payload: AefiPreregistrationDto) {
		await this.vaccinePreregistrationService.createVaccinePreregistrationSelfReporting(payload);
		return {
			message: 'Preregistration and AEIFs successfully created',
		};
	}
}
