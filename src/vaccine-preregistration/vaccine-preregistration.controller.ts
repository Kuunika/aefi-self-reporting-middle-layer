import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AefiPreregistrationDto } from '../common/dtos/aefi-preregistry.dto';
import { ApiBody } from '@nestjs/swagger';
import { VaccinePreregistrationService } from './vaccine-preregistration.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
@UseInterceptors(LoggingInterceptor)
@Controller('vaccine-preregistrations')
export class VaccinePreregistrationController {
	constructor(private readonly vaccinePreregistrationService: VaccinePreregistrationService) {}

	@Post()
	@ApiBody({ type: AefiPreregistrationDto, description: 'Creates new registration for non-existing tracked entity instance' })
	async createAefiVaccinePreregistration(@Body() payload: AefiPreregistrationDto) {
		await this.vaccinePreregistrationService.createVaccinePreregistrationSelfReporting(payload);
		return {
			message: 'Preregistration and AEIFs successfully created',
		};
	}
}
