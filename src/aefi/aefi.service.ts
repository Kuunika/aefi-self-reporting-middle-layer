import { Injectable } from '@nestjs/common';
import { DataElement, Dhis2DataElement } from '../common/types';
import { AefiSignsSymptomsDto } from '../common/dtos/aefi-signs-symptoms.dto';
import { OhspClientService } from 'src/ohsp/ohsp-client.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AefiService {
	constructor(private readonly configService: ConfigService, private readonly ohspClient: OhspClientService) {}

	async getAllAefiSignsAndSymptoms(): Promise<AefiSignsSymptomsDto> {
		const SIGN_AND_SYMPTOMS = this.configService.get<string>('SIGN_AND_SYMPTOMS_URL');
		const AEFI_SEVERITY_OPTION_SET = this.configService.get<string>('AEFI_SEVERITY_OPTION_SET');
		const signAndSymptomsDataElements: Dhis2DataElement = await this.ohspClient.getDhis2Resource<Dhis2DataElement>(SIGN_AND_SYMPTOMS);
		const severityOptionSetValues = await this.ohspClient.getOptionsSetValues(AEFI_SEVERITY_OPTION_SET);
		const severityOptions = await Promise.all(severityOptionSetValues.options.map((option) => this.ohspClient.getOption(option.id)));

		const formatDataElementToDto = (de: DataElement) => ({ name: de.displayName.split(' ').at(-1), dataElementId: de.id });
		return {
			aefiSymptoms: signAndSymptomsDataElements.dataElements.map(formatDataElementToDto),
			aefiSeverity: severityOptions.map((option) => ({ name: option.displayName, dataElementId: option.code })),
		};
	}
}
