import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DistrictsDto } from '../common/dtos/districts.dto';
import { Dhis2OptionSet, Dhis2Option } from '../common/types';
import { OhspClientService } from '../ohsp/ohsp-client.service';
import { Cache } from 'cache-manager';

@Injectable()
export class DistrictService {
	constructor(
		private readonly ohspClient: OhspClientService,
		private readonly config: ConfigService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	async getAllDistricts(): Promise<DistrictsDto> {
		const fromCache = await this.cacheManager.get<DistrictsDto>('districts');
		if (fromCache) {
			return fromCache;
		}
		const DISTRICTS_OPTION_SET_ID = this.config.get<string>('DISTRICTS_OPTION_SET_ID');
		const optionSet = await this.ohspClient.findDhis2Resource<Dhis2OptionSet>(`/optionSets/${DISTRICTS_OPTION_SET_ID}.json`);
		const options = optionSet.options.map((option) => this.ohspClient.getDhis2Resource<Dhis2Option>(`/options/${option.id}.json`));
		const districts = { districts: (await Promise.all(options)).map((option) => option.code) };

		await this.cacheManager.set('districts', districts, { ttl: 40_000 });
		return districts;
	}
}
