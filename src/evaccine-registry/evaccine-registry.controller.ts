import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrackedEntityInstanceFoundDto } from '../common/dtos/trackedEntityInstanceFound.dto';
import { CreateAefiDto } from '../common/dtos/create-aefi.dto';
import { TrackedEntityInstanceNotFoundException } from '../common/exceptions';
import { ValidatePhoneNumberPipe } from '../common/pipes/phoneNumber/validate-phone-number.pipe';
import { ValidatePatientSideEffectRecordPipe } from '../common/pipes/valiidatePatientSideEffectRecord/validate-patient-side-effect-record.pipe';
import { EvaccineRegistryService } from './evaccine-registry.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('e-vaccine-registries')
export class EvaccineRegistryController {
	constructor(private readonly eVaccineRegistryService: EvaccineRegistryService) {}

	@Get('phone-number/:phoneNumber')
	@ApiResponse({ type: TrackedEntityInstanceFoundDto, status: 200 })
	@ApiResponse({ status: 404 })
	async findTrackedEntityInstanceByPhoneNumber(
		@Param('phoneNumber', new ValidatePhoneNumberPipe()) phoneNumber: string,
	): Promise<TrackedEntityInstanceFoundDto> {
		const trackedEntityInstance = await this.eVaccineRegistryService.findTrackedEntityInstanceByPhoneNumber(phoneNumber);
		if (trackedEntityInstance) {
			return trackedEntityInstance;
		}
		throw new TrackedEntityInstanceNotFoundException();
	}

	@Get('/epi-number/:epiNumber')
	@ApiResponse({ type: TrackedEntityInstanceFoundDto, status: 200 })
	@ApiResponse({ status: 404 })
	async findTrackedEntityInstanceByEpiNumber(@Param('epiNumber') epiNumber: string): Promise<TrackedEntityInstanceFoundDto> {
		const trackedEntityInstance = await this.eVaccineRegistryService.findTrackedEntityInstanceByEpiNumber(epiNumber);
		if (trackedEntityInstance) {
			return trackedEntityInstance;
		}
		throw new TrackedEntityInstanceNotFoundException();
	}

	@Post(':epiNumber')
	@ApiBody({ type: [CreateAefiDto], description: 'Sample Description' })
	async createTrackedEntityInstanceSideEffectsRecord(
		@Param('epiNumber') epiNumber: string,
		@Body(new ValidatePatientSideEffectRecordPipe())
		payload: CreateAefiDto,
	): Promise<{
		message: string;
	}> {
		this.eVaccineRegistryService.createTrackedEntityInstanceSideEffectsRecord(epiNumber, payload);
		return {
			message: 'Record Created Successfully',
		};
	}
}
