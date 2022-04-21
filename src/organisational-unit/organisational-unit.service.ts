import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { OhspClientService } from 'src/ohsp/ohsp-client.service';
import { Cache } from 'cache-manager';
import { OrgUnit } from 'src/common/types';
@Injectable()
export class OrganisationalUnitService {
	constructor(private readonly ohspClient: OhspClientService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async getAllOrganisationalUnits() {
		const fromCache = await this.cacheManager.get<OrgUnit[]>('orgUnits');
		if (fromCache) {
			return fromCache;
		}
	}
}
