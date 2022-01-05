import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvaccineRegistryModule } from './evaccine-registry/evaccine-registry.module';
import { VaccinePreregistrationModule } from './vaccine-preregistration/vaccine-preregistration.module';
import { AefiModule } from './aefi/aefi.module';
import { VaccineModule } from './vaccine/vaccine.module';
import { AppController } from './app.controller';
import { OrganisationalUnitModule } from './organisational-unit/organisational-unit.module';

@Module({
	imports: [
		CacheModule.register({ isGlobal: true }),
		ConfigModule.forRoot({ isGlobal: true }),
		EvaccineRegistryModule,
		VaccinePreregistrationModule,
		AefiModule,
		VaccineModule,
		OrganisationalUnitModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
