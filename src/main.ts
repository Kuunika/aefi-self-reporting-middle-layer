import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get<ConfigService>(ConfigService);
	const port = config.get<number>('AEFI_API_PORT') || 3000;
	const ENVIRONMENT = config.get<string>('ENVIRONMENT');
	const prefix = ENVIRONMENT === 'SQA' ? 'aefi/api' : 'api';
	app.setGlobalPrefix(prefix);
	const documentConfig = new DocumentBuilder()
		.setTitle('AEFI API')
		.setDescription('AEFI Reporting API for WhatsApp Chatbot')
		.setVersion('1.0')
		.addTag('Initial')
		.build();
	const document = SwaggerModule.createDocument(app, documentConfig);
	SwaggerModule.setup('docs', app, document);

	await app.listen(port);
}
bootstrap();
