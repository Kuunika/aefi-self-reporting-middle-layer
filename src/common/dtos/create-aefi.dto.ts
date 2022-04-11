import { IsNotEmpty, IsOptional, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportAefiDto {
	//TODO: need a way to validate the strings, could use cache to help
	@ArrayNotEmpty()
	@ApiProperty({ example: ['exAlKwep7t'] })
	aefiSideEffects: string[];
	@IsOptional()
	@IsNotEmpty()
	@ApiProperty({ nullable: true, example: 'Pain in abdomen' })
	aefiOtherSideEffects?: string;
	@IsNotEmpty()
	@ApiProperty({ example: 'High Blood Pressure' })
	medicalHistory: string;
	@IsOptional()
	@IsNotEmpty()
	@ApiProperty({ example: 'bvS3GVQAlj' })
	aefiSeverityId: string;
	@IsNotEmpty()
	@ApiProperty({ example: 'op90Imdoaw' })
	trackedEntityInstance: string;
	@IsNotEmpty()
	@ApiProperty({ example: 'o78jf8j29r' })
	orgUnit: string;
	@IsNotEmpty()
	@ApiProperty({ example: '9sj0g30u52' })
	program: string;
	@IsNotEmpty()
	@ApiProperty({ example: '24je045md2' })
	programStage: string;
}
