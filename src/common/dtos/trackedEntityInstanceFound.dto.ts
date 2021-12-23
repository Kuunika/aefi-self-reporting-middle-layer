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
	@ApiProperty({ example: '9b776x0Ho4' })
	programId: string;
	@ApiProperty({ example: 'ab1n9aHTKD' })
	trackedEntityInstanceId: string;
	@ApiProperty({ example: 'p039dHeid' })
	orgUnitId: string;
}
