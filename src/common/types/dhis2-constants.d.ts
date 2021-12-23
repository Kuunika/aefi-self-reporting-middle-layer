import { Pager } from './dhis2-data-elements';

export interface Dhis2Constants {
	pager: Pager;
	constants: Constant[];
}

export interface Constant {
	id: string;
	displayName: string;
}
