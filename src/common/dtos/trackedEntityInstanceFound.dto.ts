import { ApiProperty } from '@nestjs/swagger';

export class TrackedEntityInstanceFoundDto {
	@ApiProperty({ example: 'John' })
	firstName: string;
	@ApiProperty({ example: 'Doe' })
	lastName: string;
	@ApiProperty({ example: 'EPI_000000' })
	epiNumber: string;
	@ApiProperty({ example: '28/7/2021' })
	dateOfSecondDosage?: string;
}
