import { IsNotEmpty, IsOptional } from 'class-validator';

export class PatientSideEffectRecordDto {
  @IsNotEmpty()
  patientSelectedSideEffects: string;
  @IsOptional()
  @IsNotEmpty()
  patientOtherSideEffects: string;
}
