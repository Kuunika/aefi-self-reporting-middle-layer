import { Module } from '@nestjs/common';
import { VaccinePreregistrationController } from './vaccine-preregistration.controller';
import { VaccinePreregistrationService } from './vaccine-preregistration.service';

@Module({
  controllers: [VaccinePreregistrationController],
  providers: [VaccinePreregistrationService]
})
export class VaccinePreregistrationModule {}
