import { ApiProperty } from '@nestjs/swagger';
export class ClientDto {
	@ApiProperty({
		example: 'The unique identifier for the client',
	})
	trackedEntityInstance: string;
	@ApiProperty({
		example: 'The Identifier of the given vaccine program',
	})
	program: string;
	@ApiProperty({
		example: 'The Identifier of the given vaccine program stage',
	})
	programStage: string;
}
