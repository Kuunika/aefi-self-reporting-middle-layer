import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrackedEntityInstanceFoundDto } from '../common/dtos/trackedEntityInstanceFound.dto';
import { PatientSideEffectRecordDto } from '../common/dtos/patientSideEffectRecord.dto';
import { TrackedEntityInstanceNotFoundException } from '../common/exceptions/trackedEntityInstanceNotFound.exception';
import { ValidatePhoneNumberPipe } from '../common/pipes/phoneNumber/validate-phone-number.pipe';
import { ValidatePatientSideEffectRecordPipe } from '../common/pipes/valiidatePatientSideEffectRecord/validate-patient-side-effect-record.pipe';
import { EvaccineRegistryService } from './evaccine-registry.service';

@Controller('e-vaccine-registries')
export class EvaccineRegistryController {
	constructor(private readonly eVaccineRegistryService: EvaccineRegistryService) {}

	@Get('phone-number/:phoneNumber')
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
	async findTrackedEntityInstanceByEpiNumber(@Param('epiNumber') epiNumber: string): Promise<TrackedEntityInstanceFoundDto> {
		const trackedEntityInstance = await this.eVaccineRegistryService.findTrackedEntityInstanceByEpiNumber(epiNumber);
		if (trackedEntityInstance) {
			return trackedEntityInstance;
		}
		throw new TrackedEntityInstanceNotFoundException();
	}

	@Post(':epiNumber')
	async createTrackedEntityInstanceSideEffectsRecord(
		@Param('epiNumber') epiNumber: string,
		@Body(new ValidatePatientSideEffectRecordPipe())
		payload: PatientSideEffectRecordDto,
	): Promise<{
		message: string;
	}> {
		this.eVaccineRegistryService.createTrackedEntityInstanceSideEffectsRecord(epiNumber, payload);
		return {
			message: 'Record Created Successfully',
		};
	}
}
