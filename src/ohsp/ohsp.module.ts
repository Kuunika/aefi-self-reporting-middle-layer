import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OhspClientService } from './ohsp-client.service';

@Module({
	imports: [
		HttpModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				baseURL: configService.get<string>('AEFI_OHSP_URL'),
				auth: {
					username: configService.get<string>('AEFI_OHSP_USERNAME'),
					password: configService.get<string>('AEFI_OHSP_PASSWORD'),
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [OhspClientService],
	exports: [HttpModule, OhspClientService],
})
export class OhspModule {}
