import { Test, TestingModule } from '@nestjs/testing';
import { EvaccineRegistryController } from './evaccine-registry.controller';

describe('EvaccineRegistryController', () => {
  let controller: EvaccineRegistryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaccineRegistryController],
    }).compile();

    controller = module.get<EvaccineRegistryController>(
      EvaccineRegistryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
