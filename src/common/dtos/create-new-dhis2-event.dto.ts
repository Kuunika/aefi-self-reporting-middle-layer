import { DHIS2Status } from '../../ohsp/enums/status';

export interface CreateNewDhis2EventDto {
	program: string;
	programStage: string;
	trackedEntityInstance: string;
	orgUnit: string;
	eventDate: string;
	status: DHIS2Status;
	completedDate: string;
	dataValues: DataValue[];
}

export interface DataValue {
	dataElement: string;
	value: string;
}
