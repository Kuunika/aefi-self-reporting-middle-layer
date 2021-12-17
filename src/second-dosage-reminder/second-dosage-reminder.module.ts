import { Module } from '@nestjs/common';
import { SecondDosageReminderService } from './second-dosage-reminder.service';
import { SecondDosageReminderController } from './second-dosage-reminder.controller';

@Module({
  providers: [SecondDosageReminderService],
  controllers: [SecondDosageReminderController]
})
export class SecondDosageReminderModule {}
