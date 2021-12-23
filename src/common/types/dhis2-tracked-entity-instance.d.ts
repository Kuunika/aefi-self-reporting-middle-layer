export interface IDhis2TrackedEntityInstance {
	trackedEntityInstances: TrackedEntityInstance[];
}

export interface TrackedEntityInstance {
	orgUnit: string;
	trackedEntityInstance: string;
	attributes: Attribute[];
	enrollments: Enrollment[];
}

export interface Attribute {
	lastUpdated: string;
	storedBy: string;
	displayName: string;
	created: string;
	valueType: string;
	attribute: string;
	value: string;
}

export interface Enrollment {
	events: Event[];
}

export interface Event {
	storedBy: string;
	dueDate: string;
	program: string;
	event: string;
	programStage: string;
	orgUnit: string;
	trackedEntityInstance: string;
	enrollment: string;
	enrollmentStatus: string;
	status: string;
	orgUnitName: string;
	eventDate: string;
	lastUpdated: string;
	created: string;
	completedDate?: string;
	followup: boolean;
	deleted: boolean;
	attributeOptionCombo: string;
	dataValues: DataValue[];
	notes: any[];
	createdAtClient?: string;
	lastUpdatedAtClient?: string;
}

export interface DataValue {
	lastUpdated: string;
	created: string;
	dataElement: string;
	value: string;
	providedElsewhere: boolean;
	storedBy?: string;
}
