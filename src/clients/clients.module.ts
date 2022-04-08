import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { OhspModule } from 'src/ohsp/ohsp.module';

@Module({
	providers: [ClientsService],
	controllers: [ClientsController],
	imports: [OhspModule],
})
export class ClientsModule {}
