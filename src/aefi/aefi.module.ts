import { Module } from '@nestjs/common';
import { AefiController } from './aefi.controller';
import { AefiService } from './aefi.service';

@Module({
  controllers: [AefiController],
  providers: [AefiService]
})
export class AefiModule {}
