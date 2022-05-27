import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ReportedAefiDocument = ReportedAefi & Document;

@Schema()
export class ReportedAefi {
	@Prop({
		unique: true,
	})
	transactionId?: string;
	@Prop()
	trackedEntityInstance?: string;
	@Prop()
	aefiSideEffects: AefiSideEffects[];
	@Prop()
	aefiOtherSideEffects?: string;
	@Prop()
	medicalHistory: string;
	@Prop()
	aefiSeverityId: string;
	@Prop()
	vaccineCode: string;
	@Prop()
	vaccinationDate: string;
	@Prop()
	orgUnit: string;
	@Prop()
	program: string;
	@Prop()
	programStage: string;
}
@Schema()
export class AefiSideEffects {
	@Prop()
	dataElement: string;
	@Prop()
	value?: string;
}

export const ReportedAefiSchema = SchemaFactory.createForClass(ReportedAefi);
