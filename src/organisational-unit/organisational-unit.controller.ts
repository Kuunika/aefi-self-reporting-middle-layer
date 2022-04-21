import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { OrganisationUnitDto } from '../common/dtos/organisationUnits.dto';
import { OrganisationalUnitService } from './organisational-unit.service';

@Controller('organisational-units')
export class OrganisationalUnitController {
	constructor(private readonly organisationalUnitService: OrganisationalUnitService) {}
	@Get()
	@ApiResponse({ type: [OrganisationUnitDto], status: 200 })
	getAllOrganisationalUnit() {
		return this.organisationalUnitService.getAllOrganisationalUnits();
	}
}
