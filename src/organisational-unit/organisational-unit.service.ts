import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { OhspClientService } from 'src/ohsp/ohsp-client.service';
import { Cache } from 'cache-manager';
import { OrgUnit } from 'src/common/types';
@Injectable()
export class OrganisationalUnitService {
	constructor(private readonly ohspClient: OhspClientService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async getAllOrganisationalUnits() {
		const fromCache = await this.cacheManager.get<{ displayName: string; orgUnitId: string }>('orgUnits');
		if (fromCache) {
			return fromCache;
		}
		let orgUnits;
		try {
			orgUnits = (
				await this.ohspClient.findDhis2Resource<OrgUnit>('/organisationUnits.json?paging=false&filter=level:eq:4')
			).organisationUnits.map((org) => ({
				displayName: org.displayName,
				orgUnitId: org.id,
			}));
		} catch (error) {
			console.log(error);
		}

		await this.cacheManager.set('orgUnits', orgUnits, { ttl: 40_000 });
		return orgUnits;
	}
}
