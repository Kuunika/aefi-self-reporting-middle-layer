import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { OhspModule } from 'src/ohsp/ohsp.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schema/client.schema';

@Module({
	providers: [ClientsService],
	controllers: [ClientsController],
	imports: [
		MongooseModule.forFeature([
			{
				name: Client.name,
				schema: ClientSchema,
			},
		]),
		OhspModule,
	],
})
export class ClientsModule {}
