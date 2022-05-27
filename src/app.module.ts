import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EvaccineRegistryModule } from './evaccine-registry/evaccine-registry.module';
import { AefiModule } from './aefi/aefi.module';
import { VaccineModule } from './vaccine/vaccine.module';
import { AppController } from './app.controller';
import { OrganisationalUnitModule } from './organisational-unit/organisational-unit.module';
import { DistrictModule } from './district/district.module';
import { LoggingModule } from './common/services';
import { ClientsModule } from './clients/clients.module';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (service: ConfigService) => ({
				uri: service.get<string>('MONGO_URI'),
			}),
			inject: [ConfigService],
		}),
		LoggingModule,
		EvaccineRegistryModule,
		AefiModule,
		VaccineModule,
		OrganisationalUnitModule,
		DistrictModule,
		ClientsModule,
		CacheModule.register({ isGlobal: true }),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
