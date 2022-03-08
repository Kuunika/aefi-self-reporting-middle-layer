import { ApiProperty } from '@nestjs/swagger';

export class VaccineTypeDto {
	@ApiProperty({ example: 'Astrozenica' })
	vaccineName: string;
	@ApiProperty({ example: 'QsbEbv8qqt' })
	categoryOptionId: string;
	@ApiProperty({ example: 1 })
	numberOfDosages: number;
}