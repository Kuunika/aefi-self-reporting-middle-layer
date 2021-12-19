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
	@ApiProperty({ example: true })
	sex: boolean;
	@ApiProperty()
	@ApiProperty({ example: '28/1/1900' })
	dob: string;
	@ApiProperty()
	@ApiProperty({ example: '1408 Elm Street' })
	physicalAddress: string;
	@ApiProperty()
	@ApiProperty({ example: '0999999999' })
	phoneNumber: string;
	@ApiProperty()
	@ApiProperty({ example: 'VBV90JU1' })
	nationalID?: string;
}
