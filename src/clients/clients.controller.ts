import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { ClientFoundDto, CreateClientDto } from './dtos';
import { FindClientQueryString } from './query-strings/find-client';

@Controller('clients')
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@Get()
	@ApiResponse({ type: ClientFoundDto, status: 200 })
	find(@Query() query: FindClientQueryString) {
		return this.clientsService.find(query);
	}

	@Post()
	@ApiBody({ type: CreateClientDto, description: 'Creates a new client within the self registration program' })
	@ApiResponse({ type: ClientFoundDto, status: 201 })
	create(@Body() payload: CreateClientDto) {
		return this.clientsService.create(payload);
	}
}
