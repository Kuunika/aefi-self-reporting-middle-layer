import { Module } from '@nestjs/common';
import { OhspModule } from 'src/ohsp/ohsp.module';
import { AefiController } from './aefi.controller';
import { AefiService } from './aefi.service';

@Module({
	controllers: [AefiController],
	providers: [AefiService],
	imports: [OhspModule],
})
export class AefiModule {}
