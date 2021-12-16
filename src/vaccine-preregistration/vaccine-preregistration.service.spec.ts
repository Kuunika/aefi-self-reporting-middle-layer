import { Test, TestingModule } from '@nestjs/testing';
import { VaccinePreregistrationService } from './vaccine-preregistration.service';

describe('VaccinePreregistrationService', () => {
  let service: VaccinePreregistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaccinePreregistrationService],
    }).compile();

    service = module.get<VaccinePreregistrationService>(VaccinePreregistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
