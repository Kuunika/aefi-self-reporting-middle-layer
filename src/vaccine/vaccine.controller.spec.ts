import { Test, TestingModule } from '@nestjs/testing';
import { VaccineController } from './vaccine.controller';

describe('VaccineController', () => {
  let controller: VaccineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaccineController],
    }).compile();

    controller = module.get<VaccineController>(VaccineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
