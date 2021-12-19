import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationalUnitService } from './organisational-unit.service';

describe('OrganisationalUnitService', () => {
  let service: OrganisationalUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganisationalUnitService],
    }).compile();

    service = module.get<OrganisationalUnitService>(OrganisationalUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
