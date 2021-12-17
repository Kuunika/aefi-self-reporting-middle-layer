import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvaccineRegistryModule } from './evaccine-registry/evaccine-registry.module';
import { VaccinePreregistrationModule } from './vaccine-preregistration/vaccine-preregistration.module';
import { SecondDosageReminderModule } from './second-dosage-reminder/second-dosage-reminder.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), EvaccineRegistryModule, VaccinePreregistrationModule, SecondDosageReminderModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
