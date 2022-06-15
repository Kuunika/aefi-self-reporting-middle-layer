import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UseInterceptors } from '@nestjs/common';
import { ClientFoundDto } from '../common/dtos/trackedEntityInstanceFound.dto';
import { ReportAefiDto } from '../common/dtos/create-aefi.dto';
import { ValidatePhoneNumberPipe } from '../common/pipes/phoneNumber/validate-phone-number.pipe';
import { ValidatePatientSideEffectRecordPipe } from '../common/pipes';
import { EvaccineRegistryService, QUERY_DISCRIMINATOR } from './evaccine-registry.service';
import { ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OhspClientService } from 'src/ohsp/ohsp-client.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { NoTrackedEntityInstanceFound } from '../common/exceptions/no-tracked-entity-instance-found';
import { MultipleTrackedEntityInstancesFoundException } from '../common/exceptions/multiple-tracked-entity-instances-found';

@UseInterceptors(LoggingInterceptor)
@Controller('e-vaccine-registries')
export class EvaccineRegistryController {
	constructor(private readonly eVaccineRegistryService: EvaccineRegistryService, private readonly ohspClientService: OhspClientService) {}

	@Get('phone-number/:phoneNumber')
	@ApiParam({
		name: 'phoneNumber',
		description: 'Individuals phone number, please note the number should not exclude the country code, e.g. 0999999999',
	})
	@ApiResponse({ type: ClientFoundDto, status: 200 })
	@ApiResponse({ status: 404 })
	async findTrackedEntityInstanceByPhoneNumber(@Param('phoneNumber', new ValidatePhoneNumberPipe()) phoneNumber: string): Promise<ClientFoundDto> {
		try {
			const trackedEntityInstance = await this.eVaccineRegistryService.getTrackedEntityInstance(QUERY_DISCRIMINATOR.PHONE_NUMBER, phoneNumber);
			if (trackedEntityInstance) {
				return trackedEntityInstance;
			}
		} catch (error) {
			if (error instanceof NoTrackedEntityInstanceFound) {
				throw new NotFoundException(error.message);
			}
			if (error instanceof MultipleTrackedEntityInstancesFoundException) {
				throw new BadRequestException(error.message);
			}
		}
	}

	@Get('/epi-number/:epiNumber')
	@ApiParam({ name: 'epiNumber', description: 'Individuals EPI_Number, please note the number should be appended with "EPI_", e.g. EPI_0380913' })
	@ApiResponse({ type: ClientFoundDto, status: 200 })
	@ApiResponse({ status: 404 })
	async findTrackedEntityInstanceByEpiNumber(@Param('epiNumber') epiNumber: string): Promise<ClientFoundDto> {
		try {
			const trackedEntityInstance = await this.eVaccineRegistryService.getTrackedEntityInstance(QUERY_DISCRIMINATOR.EPI_NUMBER, epiNumber);
			if (trackedEntityInstance) {
				return trackedEntityInstance;
			}
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
	@ApiBody({ type: ReportAefiDto, description: 'Sample Description' })
	async createTrackedEntityInstanceSideEffectsRecord(
		@Body(new ValidatePatientSideEffectRecordPipe())
		payload: ReportAefiDto,
	): Promise<{
		message: string;
	}> {
		//const result = await this.ohspClientService.createVaccineEvent(payload);

		return {
			message: 'Record Created Successfully',
		};
	}
}
