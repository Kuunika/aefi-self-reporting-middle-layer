import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DistrictsDto } from '../common/dtos/districts.dto';
import { Dhis2OptionSet, Dhis2Option } from '../common/types';
import { OhspClientService } from '../ohsp/ohsp-client.service';

@Injectable()
export class DistrictService {
	constructor(private readonly ohspClient: OhspClientService, private readonly config: ConfigService) {}

	async getAllDistricts(): Promise<DistrictsDto> {
		const DISTRICTS_OPTION_SET_ID = this.config.get<string>('DISTRICTS_OPTION_SET_ID');
		const optionSet = await this.ohspClient.getDhis2Resource<Dhis2OptionSet>(`/optionSets/${DISTRICTS_OPTION_SET_ID}.json`);
		const options = optionSet.options.map((option) => this.ohspClient.getDhis2Resource<Dhis2Option>(`/options/${option.id}.json`));
		return { districts: (await Promise.all(options)).map((option) => option.code) };
	}
}
