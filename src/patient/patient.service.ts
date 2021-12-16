import { Injectable } from '@nestjs/common';
import { PatientFoundDto } from 'src/common/dtos/patientFound.dto';

@Injectable()
export class PatientService {
  async findPatientByPhoneNumber(
    phoneNumber: string,
  ): Promise<PatientFoundDto> {
    return null;
  }
}
