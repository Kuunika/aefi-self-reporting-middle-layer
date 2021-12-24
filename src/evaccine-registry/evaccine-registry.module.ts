import { Module } from '@nestjs/common';
import { VaccineService } from 'src/vaccine/vaccine.service';
import { OhspModule } from '../ohsp/ohsp.module';
import { EvaccineRegistryController } from './evaccine-registry.controller';
import { EvaccineRegistryService } from './evaccine-registry.service';

@Module({
	controllers: [EvaccineRegistryController],
	providers: [EvaccineRegistryService, VaccineService],
	imports: [OhspModule],
})
export class EvaccineRegistryModule {}
