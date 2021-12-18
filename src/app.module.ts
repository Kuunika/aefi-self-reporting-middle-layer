import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvaccineRegistryModule } from './evaccine-registry/evaccine-registry.module';
import { VaccinePreregistrationModule } from './vaccine-preregistration/vaccine-preregistration.module';
import { AefiModule } from './aefi/aefi.module';
import { VaccineModule } from './vaccine/vaccine.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), EvaccineRegistryModule, VaccinePreregistrationModule, AefiModule, VaccineModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
