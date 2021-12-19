import { Access } from './dhis2-options-set';

export interface Dhis2Option {
	code: string;
	lastUpdated: string;
	id: string;
	href: string;
	created: string;
	name: string;
	displayName: string;
	externalAccess: boolean;
	displayFormName: string;
	sortOrder: number;
	favorite: boolean;
	access: Access;
	optionSet: OptionSet;
	favorites: any[];
	translations: any[];
	userGroupAccesses: any[];
	attributeValues: any[];
	userAccesses: any[];
}

export interface OptionSet {
	id: string;
}
