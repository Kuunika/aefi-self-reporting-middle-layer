export interface Dhis2EnrolmentAndEvent {
	trackedEntityType: string;
	orgUnit: string;
	attributes: Attribute[];
	enrolments: Enrolment[];
}

export interface Attribute {
	attribute: string;
	value: string;
}

export interface Enrolment {
	orgUnit: string;
	program: string;
	enrolmentDate: string;
	incidentDate: string;
	events: Event[];
}

export interface Event {
	program: string;
	orgUnit: string;
	eventDate: string;
	status: string;
	storedBy: string;
	programStage: string;
	dataValues: DataValue[];
}

export interface DataValue {
	dataElement: string;
	value: string;
}
