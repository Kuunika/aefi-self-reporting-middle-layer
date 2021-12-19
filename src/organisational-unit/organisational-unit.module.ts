import { Module } from '@nestjs/common';
import { OrganisationalUnitController } from './organisational-unit.controller';
import { OhspModule } from '../ohsp/ohsp.module';

@Module({
	providers: [],
	controllers: [OrganisationalUnitController],
	imports: [OhspModule],
})
export class OrganisationalUnitModule {}
