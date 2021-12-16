import { Test, TestingModule } from '@nestjs/testing';
import { EvaccineRegistryService } from './evaccine-registry.service';

describe('EvaccineRegistryService', () => {
  let service: EvaccineRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvaccineRegistryService],
    }).compile();

    service = module.get<EvaccineRegistryService>(EvaccineRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
