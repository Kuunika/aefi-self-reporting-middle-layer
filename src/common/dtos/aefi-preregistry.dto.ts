import { CreateAefiDto } from './create-aefi.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Vaccination } from './vaccination.dto';

export class AefiPreregistrationDto {
	@ApiProperty()
	aefiSignsAndSymptoms: CreateAefiDto;
	@ApiProperty()
	vaccination: Vaccination;
	@ApiProperty()
	@ApiProperty({ example: 'John' })
	firstName: string;
	@ApiProperty()
	@ApiProperty({ example: 'Doe' })
	surname: string;
	@ApiProperty()
	@ApiProperty({ example: 'male' })
	gender: string;
	@ApiProperty()
	@ApiProperty({ example: '1992-04-10' })
	dob: string;
	@ApiProperty()
	@ApiProperty({ example: '0999999999' })
	phoneNumber: string;
	@ApiProperty()
	@ApiProperty({ example: 'VBV90JU1' })
	nationalID?: string;
	@ApiProperty()
	@ApiProperty({ example: 'Blantyre' })
	districtOfResidence: string;
	@ApiProperty()
	@ApiProperty({ example: '1408 Elm St. Mandala' })
	physicalAddress: string;
}
