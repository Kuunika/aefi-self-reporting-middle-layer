import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OhspModule } from 'src/ohsp/ohsp.module';
import { AefiController } from './aefi.controller';
import { AefiService } from './aefi.service';
import { ReportedAefi, ReportedAefiSchema } from './schema/aefi.schema';

@Module({
	controllers: [AefiController],
	providers: [AefiService],
	imports: [
		OhspModule,
		MongooseModule.forFeature([
			{
				name: ReportedAefi.name,
				schema: ReportedAefiSchema,
			},
		]),
	],
})
export class AefiModule {}
