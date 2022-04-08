import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateClientDto } from '../common/dtos/aefi-preregistry.dto';
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
	@ApiBody({ type: CreateClientDto, description: 'Creates a new client within the self registration program' })
	create(@Body() payload: CreateClientDto) {
		return this.clientsService.create(payload);
	}
}
