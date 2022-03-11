import { Controller, Get } from '@nestjs/common';
import { join } from 'path';
import { readFile } from 'fs/promises';

@Controller('temp')
export class TempController {
	@Get()
	async getLog() {
		const file = await readFile(join(__dirname, '..', 'logs', 'aefi-2022-03-11.info.log'), 'utf-8');
		return file;
	}
}
