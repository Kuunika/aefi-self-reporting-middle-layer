import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrackedEntityInstanceFoundDto } from '../common/dtos/trackedEntityInstanceFound.dto';
import { PatientSideEffectRecordDto } from 'src/common/dtos/patientSideEffectRecord.dto';
import { ServerUnavailableException } from 'src/common/exceptions/serverUnavailable.exception';
import { TrackedEntityInstanceNotFoundException } from 'src/common/exceptions/trackedEntityInstanceNotFound.exception';
import { ValidatePhoneNumberPipe } from 'src/common/pipes/phoneNumber/validate-phone-number.pipe';
import { ValidatePatientSideEffectRecordPipe } from 'src/common/pipes/valiidatePatientSideEffectRecord/validate-patient-side-effect-record.pipe';
import { EvaccineRegistryService } from './evaccine-registry.service';

@Controller('e-vaccine-registries')
export class EvaccineRegistryController {
  constructor(
    private readonly eVaccineRegistryService: EvaccineRegistryService,
  ) {}

  @Get('phone-number/:phoneNumber')
  async findTrackedEntityInstanceByPhoneNumber(
    @Param('phoneNumber', new ValidatePhoneNumberPipe()) phoneNumber: string,
  ): Promise<TrackedEntityInstanceFoundDto> {
    const trackedEntityInstance =
      await this.eVaccineRegistryService.findTrackedEntityInstanceByPhoneNumber(
        phoneNumber,
      );
    if (trackedEntityInstance) {
      return trackedEntityInstance;
    }
    throw new TrackedEntityInstanceNotFoundException();
  }

  @Get('/epi-number/:epiNumber')
  async findTrackedEntityInstanceByEpiNumber(
    @Param('epiNumber') epiNumber: string,
  ) {
    const trackedEntityInstance =
      await this.eVaccineRegistryService.findTrackedEntityInstanceByEpiNumber(
        epiNumber,
      );
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
  ) {
    throw new ServerUnavailableException();
  }
}
