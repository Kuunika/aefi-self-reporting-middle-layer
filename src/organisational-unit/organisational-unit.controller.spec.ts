import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationalUnitController } from './organisational-unit.controller';

describe('OrganisationalUnitController', () => {
  let controller: OrganisationalUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganisationalUnitController],
    }).compile();

    controller = module.get<OrganisationalUnitController>(OrganisationalUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
