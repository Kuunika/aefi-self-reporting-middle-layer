import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { NewClientDto } from 'src/common/dtos/new-client.dto';
import { MultipleTrackedEntityInstancesFoundException } from 'src/common/exceptions/multiple-tracked-entity-instances-found';
import { NoTrackedEntityInstanceFound } from 'src/common/exceptions/no-tracked-entity-instance-found';
import { ClientsService } from './clients.service';
import { ClientFoundDto, CreateClientDto } from './dtos';
import { FindClientQueryString } from './query-strings/find-client';
import { log } from 'console';

@Controller('clients')
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@Get()
	@ApiQuery({
		name: 'phone_number',
		description: 'Individuals phone number, please note the number should not exclude the country code, e.g. 0999999999',
	})
	@ApiQuery({ name: 'epi_number', description: 'Individuals EPI_Number, please note the number should be appended with "EPI_", e.g. EPI_0380913' })
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
	@ApiResponse({ type: NewClientDto, status: 201 })
	create(@Body() payload: CreateClientDto) {
		return this.clientsService.create(payload);
	}
}
