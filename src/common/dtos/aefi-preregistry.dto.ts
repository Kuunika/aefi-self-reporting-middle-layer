import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
export class CreateClientDto {
	@ApiProperty({ example: 'John' })
	firstName: string;
	@ApiProperty({ example: 'Doe' })
	surname: string;
	@ApiProperty({ example: 'male' })
	gender: string;
	@ApiProperty({ example: '1992-04-10' })
	@IsDateString()
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
	@IsDateString()
	incidentDate: string;
	@ApiProperty({ example: 'op9scvEdIJz' })
	orgUnit: string;
}
