import { Test, TestingModule } from '@nestjs/testing';
import { OhspClientService } from './ohsp-client.service';

describe('OhspClientService', () => {
  let service: OhspClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OhspClientService],
    }).compile();

    service = module.get<OhspClientService>(OhspClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
