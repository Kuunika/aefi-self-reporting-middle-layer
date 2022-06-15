import { ApiProperty } from '@nestjs/swagger';

export class AefiReportedSuccessfullyDto {
	@ApiProperty({
		example: 'AEFIs successfully reported',
	})
	message: string;
}
