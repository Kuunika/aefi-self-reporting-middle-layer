import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
export class NewClientDto {
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
	enrollmentDate: string;
	@ApiProperty({ example: 'op9scvEdIJz' })
	orgUnit: string;
	@ApiProperty({ example: 'ejasod032fwq' })
	transactionId: string;
	@ApiProperty({ example: '8dpjd00ndod' })
	program: string;
	@ApiProperty({ example: '3jdi2mduw2r' })
	programStage: string;
}
