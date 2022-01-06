import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OhspModule } from '../ohsp/ohsp.module';
import { VaccineController } from './vaccine.controller';
import { VaccineService } from './vaccine.service';

@Module({
	controllers: [VaccineController],
	providers: [
		VaccineService,
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
	],
	imports: [
		OhspModule,
		CacheModule.register({
			ttl: 864_000,
		}),
	],
})
export class VaccineModule {}
