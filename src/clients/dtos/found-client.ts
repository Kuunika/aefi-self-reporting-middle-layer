import { ApiProperty } from '@nestjs/swagger';
export class ClientFoundDto {
	@ApiProperty({
		example: 'd0m3eaq9',
	})
	trackedEntityInstance: string;
	@ApiProperty({
		example: 'si3f0a32',
	})
	program: string;
	@ApiProperty({
		example: '3id9smf2',
	})
	programStage: string;
	@ApiProperty({
		example: 'John',
	})
	firstName: string;
	@ApiProperty({
		example: 'Doe',
	})
	surname: string;
	@ApiProperty({
		example: 'd03no03dz',
	})
	orgUnit?: string;
	@ApiProperty({
		example: '2022-09-28',
	})
	lastVaccinationDate?: string;
}
