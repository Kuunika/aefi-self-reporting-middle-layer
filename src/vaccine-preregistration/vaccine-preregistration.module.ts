import { Module } from '@nestjs/common';
import { OhspModule } from 'src/ohsp/ohsp.module';
import { VaccinePreregistrationController } from './vaccine-preregistration.controller';
import { VaccinePreregistrationService } from './vaccine-preregistration.service';

@Module({
	controllers: [VaccinePreregistrationController],
	providers: [VaccinePreregistrationService],
	imports: [OhspModule],
})
export class VaccinePreregistrationModule {}
