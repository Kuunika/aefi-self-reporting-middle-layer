import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AefiPreregistrationDto } from '../common/dtos/aefi-preregistry.dto';
import { ApiBody } from '@nestjs/swagger';
import { VaccinePreregistrationService } from './vaccine-preregistration.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';
@UseInterceptors(LoggingInterceptor)
@Controller('vaccine-preregistrations')
export class VaccinePreregistrationController {
	constructor(private readonly vaccinePreregistrationService: VaccinePreregistrationService, private readonly configService: ConfigService) {}

	@Post()
	@ApiBody({ type: AefiPreregistrationDto, description: 'Creates new registration for non-existing tracked entity instance' })
	async createAefiVaccinePreregistration(@Body() payload: AefiPreregistrationDto) {
		const trackedEntityInstanceId = await this.vaccinePreregistrationService.createVaccinePreregistrationSelfReporting(payload);
		return {
			message: 'Preregistration and AEIFs successfully created',
			trackedEntityInstanceId,
			program: this.configService.get<string>('AEFI_SELF_REGISTRATION_PROGRAM'),
			programStage: this.configService.get<string>('AEFI_SELF_REGISTRATION_STAGE'),
		};
	}
}
