import { CacheInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { OhspClientService } from 'src/ohsp/ohsp-client.service';
import { ApiResponse } from '@nestjs/swagger';
import { OrganisationUnitDto } from '../common/dtos/organisationUnits.dto';

@Controller('organisational-units')
@UseInterceptors(CacheInterceptor)
export class OrganisationalUnitController {
	constructor(private readonly ohspClient: OhspClientService) {}
	@Get()
	@ApiResponse({ type: [OrganisationUnitDto], status: 200 })
	getAllOrganisationalUnit() {
		return this.ohspClient.getAllOrganisationalUnits();
	}
}