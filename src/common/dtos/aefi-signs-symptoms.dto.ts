export class AefiSignsSymptomsDto {
	aefiSymptoms: AefiDataElement[];
	aefiSeverity: AefiDataElement[];
}

class AefiDataElement {
	name: string;
	dataElementId: string;
}
