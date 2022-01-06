import { Module } from '@nestjs/common';
import { OhspModule } from 'src/ohsp/ohsp.module';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';

@Module({
	controllers: [DistrictController],
	providers: [DistrictService],
	imports: [OhspModule],
})
export class DistrictModule {}
