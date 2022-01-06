import { ApiProperty } from '@nestjs/swagger';

export class Vaccination {
	@ApiProperty({ example: '2020-04-10' })
	dateOfVaccination: string;
	@ApiProperty({ example: 'QsbEbv8qqt' })
	vaccineTypeId: string;
}
