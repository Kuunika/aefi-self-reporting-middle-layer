import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { DataElement, Dhis2DataElement } from '../common/types';
import { AefiSignsSymptomsDto } from './dtos/aefi-signs-symptoms';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { ConfigService } from '@nestjs/config';
import { ReportAefiDto } from '../common/dtos/create-aefi.dto';
import { LoggingService } from 'src/common/services/logging/logging.service';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { ReportedAefi, ReportedAefiDocument } from './schema/aefi.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DuplicateTransactionIdError } from './exceptions/duplicate-transaction-id';

@Injectable()
export class AefiService {
	constructor(
		private readonly configService: ConfigService,
		private readonly ohspClient: OhspClientService,
		private readonly log: LoggingService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		@InjectModel(ReportedAefi.name) private readonly reportedAefiModel: Model<ReportedAefiDocument>,
	) {}

	async getAllAefiSignsAndSymptoms(): Promise<AefiSignsSymptomsDto> {
		const fromCache = await this.cacheManager.get<AefiSignsSymptomsDto>('aefiSignsAndSymptoms');
		if (fromCache) {
			return fromCache;
		}

		const SIGN_AND_SYMPTOMS_URL = this.configService.get<string>('SIGN_AND_SYMPTOMS_URL');
		const AEFI_SEVERITY_OPTION_SET = this.configService.get<string>('AEFI_SEVERITY_OPTION_SET');
		const signAndSymptomsDataElements: Dhis2DataElement = await this.ohspClient.getDhis2Resource<Dhis2DataElement>(SIGN_AND_SYMPTOMS_URL);
		const severityOptionSetValues = await this.ohspClient.getOptionsSetValues(AEFI_SEVERITY_OPTION_SET);
		const severityOptions = await Promise.all(severityOptionSetValues.options.map((option) => this.ohspClient.getOption(option.id)));

		const formatDataElementToDto = (de: DataElement) => ({ name: de.displayName.split(' ').at(-1), dataElementId: de.id });
		const aefiSignsAndSymptoms = {
			aefiSymptoms: signAndSymptomsDataElements.dataElements.map(formatDataElementToDto),
			aefiSeverity: severityOptions.map((option) => ({ name: option.displayName, dataElementId: option.code })),
		};

		await this.cacheManager.set('aefiSignsAndSymptoms', aefiSignsAndSymptoms, { ttl: 40_000 });

		return aefiSignsAndSymptoms;
	}

	async report({
		program,
		programStage,
		aefiSeverityId,
		aefiSideEffects,
		trackedEntityInstance,
		transactionId,
		orgUnit,
		vaccineCode,
		vaccinationDate,
		medicalHistory,
		aefiOtherSideEffects,
	}: ReportAefiDto) {
		const reportedAefi = new this.reportedAefiModel();
		reportedAefi.program = program;
		reportedAefi.programStage = programStage;
		reportedAefi.aefiSeverityId = aefiSeverityId;
		reportedAefi.aefiSideEffects = aefiSideEffects;
		reportedAefi.aefiOtherSideEffects = aefiOtherSideEffects;
		reportedAefi.trackedEntityInstance = trackedEntityInstance;
		reportedAefi.transactionId = transactionId;
		reportedAefi.orgUnit = orgUnit;
		reportedAefi.medicalHistory = medicalHistory;
		reportedAefi.vaccineCode = vaccineCode;
		reportedAefi.vaccinationDate = vaccinationDate;
		try {
			await reportedAefi.save();
		} catch (error) {
			this.log.error(`Error saving aefi report: ${error}`);
			throw new DuplicateTransactionIdError(transactionId);
		}

		return {
			message: 'AEFIs successfully reported',
		};
	}
}
