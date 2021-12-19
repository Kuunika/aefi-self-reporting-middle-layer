import { ApiProperty } from '@nestjs/swagger';

export class Vaccination {
	@ApiProperty({ example: '28/1/1900' })
	dateOfVaccination: string;
	@ApiProperty({ example: 'Bingu National Stadium ' })
	vaccinationSite: string;
	@ApiProperty({ example: 'QsbEbv8qqt' })
	vaccineTypeId: string;
}
