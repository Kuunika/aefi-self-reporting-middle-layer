import { Test, TestingModule } from '@nestjs/testing';
import { VaccinePreregistrationController } from './vaccine-preregistration.controller';

describe('VaccinePreregistrationController', () => {
	let controller: VaccinePreregistrationController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [VaccinePreregistrationController],
		}).compile();

		controller = module.get<VaccinePreregistrationController>(VaccinePreregistrationController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
