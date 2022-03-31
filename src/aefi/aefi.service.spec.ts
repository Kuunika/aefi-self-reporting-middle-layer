import { Test, TestingModule } from '@nestjs/testing';
import { AefiService } from './aefi.service';

describe('AefiService', () => {
	let service: AefiService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AefiService],
		}).compile();

		service = module.get<AefiService>(AefiService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
