export interface Dhis2Error {
	httpStatus: string;
	httpStatusCode: number;
	status: string;
	message: string;
	response: Response;
}

export interface ImportSummary {
	responseType: string;
	status: string;
	importOptions: ImportOptions;
	importCount: ImportCount;
	conflicts: Conflict[];
	enrollments: Response;
}

export interface Response {
	responseType: string;
	status: string;
	imported: number;
	updated: number;
	deleted: number;
	ignored: number;
	importOptions?: ImportOptions;
	importSummaries: ImportSummary[];
	total: number;
}

export interface Conflict {
	value: string;
}

export interface ImportCount {
	imported: number;
	updated: number;
	ignored: number;
	deleted: number;
}

export interface ImportOptions {
	idSchemes: IDSchemes;
	dryRun: boolean;
	async: boolean;
	importStrategy: string;
	mergeMode: string;
	reportMode: string;
	skipExistingCheck: boolean;
	sharing: boolean;
	skipNotifications: boolean;
	skipAudit: boolean;
	datasetAllowsPeriods: boolean;
	strictPeriods: boolean;
	strictDataElements: boolean;
	strictCategoryOptionCombos: boolean;
	strictAttributeOptionCombos: boolean;
	strictOrganisationUnits: boolean;
	requireCategoryOptionCombo: boolean;
	requireAttributeOptionCombo: boolean;
	skipPatternValidation: boolean;
	ignoreEmptyCollection: boolean;
	force: boolean;
	firstRowIsHeader: boolean;
	skipLastUpdated: boolean;
	mergeDataValues: boolean;
	skipCache: boolean;
}

export interface IDSchemes {}
