import { Test, TestingModule } from '@nestjs/testing';
import { SecondDosageReminderController } from './second-dosage-reminder.controller';

describe('SecondDosageReminderController', () => {
  let controller: SecondDosageReminderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecondDosageReminderController],
    }).compile();

    controller = module.get<SecondDosageReminderController>(SecondDosageReminderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
