import { ApiProperty } from '@nestjs/swagger';
export class DistrictsDto {
	@ApiProperty({ example: ['Blantyre', 'Lilongwe', 'Zomba'] })
	districts: string[];
}
