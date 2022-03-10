import { Module } from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { OhspModule } from '../ohsp/ohsp.module';
import { VaccinePreregistrationController } from './vaccine-preregistration.controller';
import { VaccinePreregistrationService } from './vaccine-preregistration.service';

@Module({
	controllers: [VaccinePreregistrationController],
	providers: [VaccinePreregistrationService, LoggingInterceptor],
	imports: [OhspModule],
})
export class VaccinePreregistrationModule {}
