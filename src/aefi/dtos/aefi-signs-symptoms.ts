import { ApiProperty } from '@nestjs/swagger';
export class AefiSignsSymptomsDto {
	@ApiProperty({
		example: [
			{
				name: 'Abscess',
				dataElementId: 'exAlKwep7t',
			},
			{
				name: 'Fever',
				dataElementId: '3cjEwgh5UL',
			},
			{
				name: 'Seizures',
				dataElementId: 'suZQZG8Txu',
			},
		],
	})
	aefiSymptoms: AefiDataElement[];
	@ApiProperty({
		example: [
			{
				name: 'Hospitalization',
				dataElementId: 're9PVavv8r',
			},
			{
				name: 'Disability',
				dataElementId: 'bvS3GVQAlj',
			},
			{
				name: 'Birth defect',
				dataElementId: 'AK3ZQQxeV5',
			},
			{
				name: 'Life threatening',
				dataElementId: 'BNkcKXHc4s',
			},
			{
				name: 'Other',
				dataElementId: 'EM2GzldRyB',
			},
		],
	})
	aefiSeverity: AefiDataElement[];
}

class AefiDataElement {
	@ApiProperty({ example: 'Abscess' })
	name: string;
	@ApiProperty({ example: 'exAlKwep7t' })
	dataElementId: string;
}
