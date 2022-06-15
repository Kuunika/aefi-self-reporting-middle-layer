import { ApiProperty } from '@nestjs/swagger';
export class CreateClientDto {
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
	@ApiProperty({ example: 'op9scvEdIJz' })
	orgUnit: string;
	@ApiProperty({ example: 'op9scvEdIJz' })
	vaccineCode: string;
	@ApiProperty({ example: '2021-04-10' })
	incidentDate: string;
}
