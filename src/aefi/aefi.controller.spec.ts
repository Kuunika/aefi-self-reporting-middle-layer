import { Test, TestingModule } from '@nestjs/testing';
import { AefiController } from './aefi.controller';

describe('AefiController', () => {
  let controller: AefiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AefiController],
    }).compile();

    controller = module.get<AefiController>(AefiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
