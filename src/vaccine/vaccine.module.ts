import { Module } from '@nestjs/common';
import { OhspModule } from '../ohsp/ohsp.module';
import { VaccineController } from './vaccine.controller';
import { VaccineService } from './vaccine.service';

@Module({
	controllers: [VaccineController],
	providers: [VaccineService],
	imports: [OhspModule],
})
export class VaccineModule {}
