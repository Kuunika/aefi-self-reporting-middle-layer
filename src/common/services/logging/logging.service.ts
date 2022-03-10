import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger, createLogger } from 'winston';
import { join } from 'path';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggingService {
	private _infoLogger: Logger;
	private _errorLogger: Logger;

	info(log: string) {
		this._infoLogger.info(log);
	}
	error(log: string) {
		this._errorLogger.error(log);
	}

	constructor(private readonly configService: ConfigService) {
		this._infoLogger = createLogger({
			level: 'info',
			defaultMeta: { service: 'AEFI Self Reporting API' },
			transports: [this.fileTransport('info')],
		});
		this._errorLogger = createLogger({
			level: 'error',
			defaultMeta: { service: 'AEFI Self Reporting API' },
			transports: [this.fileTransport('error')],
		});
	}

	private fileTransport(logType: string): DailyRotateFile {
		return new DailyRotateFile({
			filename: `aefi-%DATE%.${logType}.log`,
			dirname: join(__dirname, '..', '..', '..', '..', 'logs'),
			datePattern: 'YYYY-MM-DD',
			maxSize: '20m',
		});
	}
}
