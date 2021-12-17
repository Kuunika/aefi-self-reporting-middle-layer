import { Injectable } from '@nestjs/common';
import { ServerUnavailableException } from '../common/exceptions/serverUnavailable.exception';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { PatientSideEffectRecordDto } from '../common/dtos/patientSideEffectRecord.dto';
import { TrackedEntityInstanceFoundDto } from '../common/dtos/trackedEntityInstanceFound.dto';

@Injectable()
export class EvaccineRegistryService {
	constructor(private readonly ohspClient: OhspClientService) {}

	async findTrackedEntityInstanceByPhoneNumber(phoneNumber: string): Promise<TrackedEntityInstanceFoundDto> {
		try {
			const request = await this.ohspClient.queryTrackedEntityByPhoneNumber(phoneNumber);

			if (request.trackedEntityInstances.length) {
				const firstName = request.trackedEntityInstances[0].attributes.find((attribute) => attribute.displayName === 'First Name').value;
				const lastName = request.trackedEntityInstances[0].attributes.find((attribute) => attribute.displayName === 'Last Name').value;

				const epiNumber = request.trackedEntityInstances[0].attributes.find(
					(attribute) => attribute.displayName === 'Unique System Identifier (EPI)',
				).value;
				return {
					epiNumber,
					firstName,
					lastName,
					dateOfSecondDosage: new Date(),
				};
			}
			return null;
		} catch (error) {
			throw new ServerUnavailableException();
		}
	}

	getSecondVaccineDate(){

	}

	async findTrackedEntityInstanceByEpiNumber(epiNumber: string): Promise<TrackedEntityInstanceFoundDto> {
		try {
			const request = await this.ohspClient.queryTrackedEntityByEpiNumber(epiNumber);

			if (request.trackedEntityInstances.length) {
				const firstName = request.trackedEntityInstances[0].attributes.find((attribute) => attribute.displayName === 'First Name').value;
				const lastName = request.trackedEntityInstances[0].attributes.find((attribute) => attribute.displayName === 'Last Name').value;
				return {
					epiNumber,
					firstName,
					lastName,
					dateOfSecondDosage: new Date(),
				};
			}
			return null;
		} catch (error) {
			throw new ServerUnavailableException();
		}
	}

	async createTrackedEntityInstanceSideEffectsRecord(epiNo: string, payload: PatientSideEffectRecordDto) {}
}
