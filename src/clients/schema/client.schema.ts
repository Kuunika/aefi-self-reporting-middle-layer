import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema()
export class Client {
	@Prop({
		unique: true,
	})
	transactionId: string;
	@Prop()
	firstName: string;
	@Prop()
	surname: string;
	@Prop()
	gender: string;
	@Prop()
	dob: string;
	@Prop()
	phoneNumber: string;
	@Prop()
	nationalID?: string;
	@Prop()
	districtOfResidence: string;
	@Prop()
	physicalAddress: string;
	@Prop()
	incidentDate: string;
	@Prop()
	orgUnit: string;
	@Prop()
	enrollmentDate: string;
	@Prop()
	program: string;
	@Prop()
	programStage: string;
	@Prop()
	trackedEntityType: string;
	@Prop()
	vaccineCode: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
