import { Test, TestingModule } from '@nestjs/testing';
import { SecondDosageReminderService } from './second-dosage-reminder.service';

describe('SecondDosageReminderService', () => {
  let service: SecondDosageReminderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecondDosageReminderService],
    }).compile();

    service = module.get<SecondDosageReminderService>(SecondDosageReminderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
