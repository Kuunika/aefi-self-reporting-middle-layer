import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OhspModule } from '../ohsp/ohsp.module';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';

@Module({
	controllers: [DistrictController],
	providers: [DistrictService],
	imports: [OhspModule],
})
export class DistrictModule {}
