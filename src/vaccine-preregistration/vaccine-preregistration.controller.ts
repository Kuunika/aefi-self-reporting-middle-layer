import { Body, Controller, Post } from '@nestjs/common';
import { AefiPreregistrationDto } from '../common/dtos/aefi-preregistry.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('vaccine-preregistrations')
export class VaccinePreregistrationController {
	@Post()
	@ApiBody({ type: AefiPreregistrationDto, description: 'Sample Description' })
	createAefiVaccinePreregistration(@Body() payload: AefiPreregistrationDto) {
		return {
			message: 'Preregistration and AEIFs successfully created',
		};
	}
}
