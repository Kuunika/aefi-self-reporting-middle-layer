import { Injectable } from '@nestjs/common';
import { AefiSignsSymptomsDto } from '../common/dtos/aefi-signs-symptoms.dto';

@Injectable()
export class AefiService {
	async getAllAefiSignsAndSymptoms(): Promise<AefiSignsSymptomsDto> {
		return {
			aefiSeverity: [
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
			aefiSymptoms: [
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
		};
	}
}
