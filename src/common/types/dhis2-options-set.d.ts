export interface Dhis2OptionSet {
	created: string;
	lastUpdated: string;
	name: string;
	href: string;
	id: string;
	displayName: string;
	publicAccess: string;
	version: number;
	externalAccess: boolean;
	valueType: string;
	favorite: boolean;
	lastUpdatedBy: LastUpdatedBy;
	access: Access;
	user: LastUpdatedBy;
	favorites: any[];
	userGroupAccesses: any[];
	attributeValues: any[];
	translations: any[];
	userAccesses: any[];
	options: Option[];
}

export interface Access {
	read: boolean;
	update: boolean;
	externalize: boolean;
	delete: boolean;
	write: boolean;
	manage: boolean;
}

export interface LastUpdatedBy {
	displayName: string;
	id: string;
	username: string;
}

export interface Option {
	id: string;
}
