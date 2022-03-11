import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { OrganisationalUnitController } from './organisational-unit.controller';
import { OhspModule } from '../ohsp/ohsp.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
	controllers: [OrganisationalUnitController],
	imports: [OhspModule],
})
export class OrganisationalUnitModule {}
