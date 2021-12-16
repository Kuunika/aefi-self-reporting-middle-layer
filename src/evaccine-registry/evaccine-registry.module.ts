import { Module } from '@nestjs/common';
import { EvaccineRegistryController } from './evaccine-registry.controller';
import { EvaccineRegistryService } from './evaccine-registry.service';

@Module({
  controllers: [EvaccineRegistryController],
  providers: [EvaccineRegistryService]
})
export class EvaccineRegistryModule {}
