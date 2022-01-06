import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OhspModule } from 'src/ohsp/ohsp.module';
import { AefiController } from './aefi.controller';
import { AefiService } from './aefi.service';

@Module({
	controllers: [AefiController],
	providers: [
		AefiService,
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
	],
	imports: [
		OhspModule,
		CacheModule.register({
			ttl: 864_000,
		}),
	],
})
export class AefiModule {}
