import { ApiProperty } from '@nestjs/swagger';

export class OrganisationUnitDto {
	@ApiProperty({ example: 'QsbEbv8qqt' })
	orgUnitId: string;
	@ApiProperty({ example: 'Metro General District Hospital' })
	displayName: string;
}
