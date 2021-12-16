import { Module } from '@nestjs/common';
import { PatientModule } from './patient/patient.module';
import { EvaccineRegistryModule } from './evaccine-registry/evaccine-registry.module';
import { VaccinePreregistrationModule } from './vaccine-preregistration/vaccine-preregistration.module';

@Module({
  imports: [PatientModule, EvaccineRegistryModule, VaccinePreregistrationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
