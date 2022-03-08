import { HttpException, HttpStatus } from '@nestjs/common';

export class ServerUnavailableException extends HttpException {
	constructor() {
		super('Sorry, the server is unavailable. Please try again later.', HttpStatus.SERVICE_UNAVAILABLE);
	}
}
