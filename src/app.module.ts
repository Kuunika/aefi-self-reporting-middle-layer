import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvaccineRegistryModule } from './evaccine-registry/evaccine-registry.module';
import { VaccinePreregistrationModule } from './vaccine-preregistration/vaccine-preregistration.module';
import { AefiModule } from './aefi/aefi.module';
import { VaccineModule } from './vaccine/vaccine.module';
import { AppController } from './app.controller';
import { OrganisationalUnitModule } from './organisational-unit/organisational-unit.module';
import { DistrictModule } from './district/district.module';
import { LoggingModule } from './common/services/logging/logging.module';
import { TempModule } from './temp/temp.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		LoggingModule,
		EvaccineRegistryModule,
		VaccinePreregistrationModule,
		AefiModule,
		VaccineModule,
		OrganisationalUnitModule,
		DistrictModule,
		TempModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
