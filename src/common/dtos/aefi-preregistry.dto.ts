import { CreateAefiDto } from './create-aefi.dto';

export class AefiPreregistrationDto {
	aefiSignsAndSymptoms: CreateAefiDto;
	vaccination: Vaccination;
	firstName: string;
	surname: string;
	sex: boolean;
	dob: string;
	physicalAddress: string;
	phoneNumber: string;
	nationalID?: string;
}

class Vaccination {
	dateOfVaccination: string;
	vaccinationSite: string;
	typeOfVaccination: string;
}
