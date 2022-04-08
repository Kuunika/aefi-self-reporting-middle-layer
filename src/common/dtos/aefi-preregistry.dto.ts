import { ApiProperty } from '@nestjs/swagger';
export class AefiPreregistrationDto {
	@ApiProperty({ example: 'John' })
	firstName: string;
	@ApiProperty({ example: 'Doe' })
	surname: string;
	@ApiProperty({ example: 'male' })
	gender: string;
	@ApiProperty({ example: '1992-04-10' })
	dob: string;
	@ApiProperty({ example: '0999999999' })
	phoneNumber: string;
	@ApiProperty({ example: 'VBV90JU1' })
	nationalID?: string;
	@ApiProperty({ example: 'Blantyre' })
	districtOfResidence: string;
	@ApiProperty({ example: '1408 Elm St. Mandala' })
	physicalAddress: string;
	@ApiProperty({ example: '2020-05-16' })
	incidentDate: string;
	@ApiProperty({ example: 'op9scvEdIJz' })
	orgUnit: string;
}
