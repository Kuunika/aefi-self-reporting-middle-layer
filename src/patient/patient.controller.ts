import { Controller, Get, Param } from '@nestjs/common';
import { PatientFoundDto } from 'src/common/dtos/patientFound.dto';
import { TrackedEntityInstanceNotFoundException } from '../common/exceptions/TrackedEntityInstanceNotFound.exception';
import { PatientService } from './patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get(':phoneNumber')
  async getPatientByPhoneNumber(
    @Param('phoneNumber') phoneNumber: string,
  ): Promise<PatientFoundDto> {
    const patient = await this.patientService.findPatientByPhoneNumber(
      phoneNumber,
    );
    if (patient) {
      return patient;
    }
    throw new TrackedEntityInstanceNotFoundException();
  }
}
