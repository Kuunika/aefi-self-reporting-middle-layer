import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DataElement, Dhis2DataElement } from '../common/types';
import { AefiSignsSymptomsDto } from './dtos/aefi-signs-symptoms';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { ConfigService } from '@nestjs/config';
import { ReportAefiDto } from '../common/dtos/create-aefi.dto';
import { CreateNewDhis2EventDto } from '../common/dtos/create-new-dhis2-event.dto';
import * as moment from 'moment';
import { DHIS2Status } from 'src/ohsp/enums/status';

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

	async report({
		program,
		programStage,
		aefiSeverityId,
		aefiSideEffects,
		trackedEntityInstance,
		orgUnit,
		vaccineCode,
		medicalHistory,
		aefiOtherSideEffects,
		vaccinationDate,
	}: ReportAefiDto) {
		const AEFI_SEVERITY = this.configService.get<string>('AEFI_SEVERITY');
		//TODO: find more appropriate name
		const AEFI_VACCINE_DHIS_OPTIONS = this.configService.get<string>('AEFI_VACCINE_DHIS_OPTIONS');
		const AEFI_MEDICAL_HISTORY = this.configService.get<string>('AEFI_MEDICAL_HISTORY');
		const AEFI_OTHER_SPECIFY = this.configService.get<string>('AEFI_OTHER_SPECIFY');
		const AEFI_VACCINATION_DATE = this.configService.get<string>('AEFI_VACCINATION_DATE');
		const payload: CreateNewDhis2EventDto = {
			program,
			programStage,
			trackedEntityInstance,
			orgUnit,
			eventDate: moment().format('YYYY-MM-DD'),
			status: DHIS2Status.COMPLETED,
			completedDate: moment().format('YYYY-MM-DD'),
			dataValues: [
				{ dataElement: AEFI_VACCINE_DHIS_OPTIONS, value: vaccineCode },
				{ dataElement: AEFI_MEDICAL_HISTORY, value: medicalHistory },
				{ dataElement: AEFI_OTHER_SPECIFY, value: aefiOtherSideEffects },
				{ dataElement: AEFI_VACCINATION_DATE, value: moment(vaccinationDate).format('YYYY-MM-DD') },
				...aefiSideEffects.map((aefiSideEffect) => ({
					dataElement: aefiSideEffect.dataElement,
					value: aefiSideEffect?.value ? aefiSideEffect.value : 'True',
				})),
				...(aefiSeverityId ? [{ dataElement: AEFI_SEVERITY, value: aefiSeverityId }] : []),
			],
		};
		await this.ohspClient.createDhis2Resource('/events', payload);
		return {
			message: 'AEFIs successfully reported',
		};
	}
}
