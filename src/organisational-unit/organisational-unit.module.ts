import { Module } from '@nestjs/common';
import { OrganisationalUnitService } from './organisational-unit.service';
import { OrganisationalUnitController } from './organisational-unit.controller';
import { OhspModule } from '../ohsp/ohsp.module';

@Module({
	providers: [OrganisationalUnitService],
	controllers: [OrganisationalUnitController],
	imports: [OhspModule],
})
export class OrganisationalUnitModule {}
