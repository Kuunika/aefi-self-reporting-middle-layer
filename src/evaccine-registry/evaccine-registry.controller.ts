import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrackedEntityInstanceFoundDto } from '../common/dtos/trackedEntityInstanceFound.dto';
import { CreateAefiDto } from '../common/dtos/create-aefi.dto';
import { TrackedEntityInstanceNotFoundException } from '../common/exceptions';
import { ValidatePhoneNumberPipe } from '../common/pipes/phoneNumber/validate-phone-number.pipe';
import { ValidatePatientSideEffectRecordPipe } from '../common/pipes/valiidatePatientSideEffectRecord/validate-patient-side-effect-record.pipe';
import { EvaccineRegistryService, QUERY_DISCRIMINATOR } from './evaccine-registry.service';
import { ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OhspClientService } from 'src/ohsp/ohsp-client.service';

@Controller('e-vaccine-registries')
export class EvaccineRegistryController {
	constructor(private readonly eVaccineRegistryService: EvaccineRegistryService, private readonly ohspClientService: OhspClientService) {}

	@Get('phone-number/:phoneNumber')
	@ApiParam({
		name: 'phoneNumber',
		description: 'Individuals phone number, please note the number should not exclude the country code, e.g. 0999999999',
	})
	@ApiResponse({ type: TrackedEntityInstanceFoundDto, status: 200 })
	@ApiResponse({ status: 404 })
	async findTrackedEntityInstanceByPhoneNumber(
		@Param('phoneNumber', new ValidatePhoneNumberPipe()) phoneNumber: string,
	): Promise<TrackedEntityInstanceFoundDto> {
		const trackedEntityInstance = await this.eVaccineRegistryService.getTrackedEntityInstance(QUERY_DISCRIMINATOR.PHONE_NUMBER, phoneNumber);
		if (trackedEntityInstance) {
			return trackedEntityInstance;
		}
		throw new TrackedEntityInstanceNotFoundException();
	}

	@Get('/epi-number/:epiNumber')
	@ApiParam({ name: 'epiNumber', description: 'Individuals EPI_Number, please note the number should be appended with "EPI_", e.g. EPI_0380913' })
	@ApiResponse({ type: TrackedEntityInstanceFoundDto, status: 200 })
	@ApiResponse({ status: 404 })
	async findTrackedEntityInstanceByEpiNumber(@Param('epiNumber') epiNumber: string): Promise<TrackedEntityInstanceFoundDto> {
		const trackedEntityInstance = await this.eVaccineRegistryService.getTrackedEntityInstance(QUERY_DISCRIMINATOR.EPI_NUMBER, epiNumber);
		if (trackedEntityInstance) {
			return trackedEntityInstance;
		}
		throw new TrackedEntityInstanceNotFoundException();
	}

	@Post()
	@ApiBody({ type: CreateAefiDto, description: 'Sample Description' })
	async createTrackedEntityInstanceSideEffectsRecord(
		@Body(new ValidatePatientSideEffectRecordPipe())
		payload: CreateAefiDto,
	): Promise<{
		message: string;
	}> {
		this.ohspClientService.createVaccineEvent(payload);
		return {
			message: 'Record Created Successfully',
		};
	}
}
