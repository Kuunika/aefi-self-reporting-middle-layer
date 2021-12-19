export interface Dhis2DataElement {
	pager: Pager;
	dataElements: DataElement[];
}

export interface DataElement {
	id: string;
	displayName: string;
}

export interface Pager {
	page: number;
	pageCount: number;
	total: number;
	pageSize: number;
}
