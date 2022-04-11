import { ApiProperty } from '@nestjs/swagger';
export class CreatedAefiDto {
	@ApiProperty({
		example: 'AEFIs successfully reported',
	})
	message: string;
}
