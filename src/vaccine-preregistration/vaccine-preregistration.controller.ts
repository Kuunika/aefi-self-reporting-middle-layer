import { Body, Controller, Post } from '@nestjs/common';
import { AefiPreregistrationDto } from '../common/dtos/aefi-preregistry.dto';

@Controller('vaccine-preregistrations')
export class VaccinePreregistrationController {
	@Post()
	createAefiVaccinePreregistration(@Body() payload: AefiPreregistrationDto) {
		return {
			message: 'Preregistration and AEIFs successfully created',
		};
	}
}
