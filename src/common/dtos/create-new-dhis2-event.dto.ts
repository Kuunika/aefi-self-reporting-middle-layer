export interface CreateNewDhis2EventDto {
	program: string;
	programStage: string;
	trackedEntityInstance: string;
	orgUnit: string;
	eventDate: string;
	status: string;
	completedDate: string;
	dataValues: DataValue[];
}

export interface DataValue {
	dataElement: string;
	value: string;
}
