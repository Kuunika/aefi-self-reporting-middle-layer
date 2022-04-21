import { Module } from '@nestjs/common';
import { OrganisationalUnitController } from './organisational-unit.controller';
import { OhspModule } from '../ohsp/ohsp.module';
import { OrganisationalUnitService } from './organisational-unit.service';

@Module({
	controllers: [OrganisationalUnitController],
	imports: [OhspModule],
	providers: [OrganisationalUnitService],
})
export class OrganisationalUnitModule {}
