import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AefiPreregistrationDto } from '../common/dtos/aefi-preregistry.dto';
import { ClientsService } from './clients.service';
import { CLIENT_NOT_FOUND_ERROR_MESSAGE } from './constants/error-messages';
import { ClientNotFoundException } from './exceptions/client-not-found.exception';
import { FindClientQueryString } from './query-strings/find-client';

@Controller('clients')
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@Get()
	find(@Query() query: FindClientQueryString) {
		return this.clientsService.find(query);
	}

	@Post()
	create(@Body() payload: AefiPreregistrationDto) {
		return this.clientsService.create(payload);
	}
}
