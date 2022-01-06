import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { OrganisationalUnitController } from './organisational-unit.controller';
import { OhspModule } from '../ohsp/ohsp.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
	],
	controllers: [OrganisationalUnitController],
	imports: [
		OhspModule,
		CacheModule.register({
			ttl: 864_000,
		}),
	],
})
export class OrganisationalUnitModule {}
