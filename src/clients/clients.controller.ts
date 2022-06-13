import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { MultipleTrackedEntityInstancesFoundException } from 'src/common/exceptions/multiple-tracked-entity-instances-found';
import { NoTrackedEntityInstanceFound } from 'src/common/exceptions/no-tracked-entity-instance-found';
import { ClientsService } from './clients.service';
import { ClientFoundDto, CreateClientDto } from './dtos';
import { FindClientQueryString } from './query-strings/find-client';

@Controller('clients')
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@Get()
	@ApiResponse({ type: ClientFoundDto, status: 200 })
	async find(@Query() query: FindClientQueryString) {
		try {
			const client = await this.clientsService.find(query);
			return client;
		} catch (error) {
			if (error instanceof NoTrackedEntityInstanceFound) {
				throw new NotFoundException(error.message);
			}
			if (error instanceof MultipleTrackedEntityInstancesFoundException) {
				throw new BadRequestException(error.message);
			}
		}
	}

	@Post()
	@ApiBody({ type: CreateClientDto, description: 'Creates a new client within the self registration program' })
	@ApiResponse({ type: ClientFoundDto, status: 201 })
	create(@Body() payload: CreateClientDto) {
		return this.clientsService.create(payload);
	}
}
