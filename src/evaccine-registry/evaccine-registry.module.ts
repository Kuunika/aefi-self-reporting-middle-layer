import { Module } from '@nestjs/common';
import { OhspModule } from '../ohsp/ohsp.module';
import { EvaccineRegistryController } from './evaccine-registry.controller';
import { EvaccineRegistryService } from './evaccine-registry.service';

@Module({
	controllers: [EvaccineRegistryController],
	providers: [EvaccineRegistryService],
	imports: [OhspModule],
})
export class EvaccineRegistryModule {}
