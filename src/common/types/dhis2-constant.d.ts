export interface Dhis2Constant {
	lastUpdated: string;
	href: string;
	id: string;
	created: string;
	name: string;
	shortName: string;
	displayName: string;
	publicAccess: string;
	displayShortName: string;
	externalAccess: boolean;
	value: number;
	displayFormName: string;
	favorite: boolean;
	access: Access;
	lastUpdatedBy: LastUpdatedBy;
	user: LastUpdatedBy;
	favorites: any[];
	translations: any[];
	userGroupAccesses: any[];
	attributeValues: any[];
	userAccesses: any[];
}
