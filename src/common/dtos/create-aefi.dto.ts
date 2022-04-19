import { IsNotEmpty, IsOptional, ArrayNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class ReportAefiDto {
	//TODO: need a way to validate the strings, could use cache to help
	@ArrayNotEmpty()
	@ApiProperty({ example: ['exAlKwep7t'] })
	aefiSideEffects: AefiSideEffects[];
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
	@IsOptional()
	@IsNotEmpty()
	@ApiProperty({ example: 'I2nf2go21' })
	vaccineCode: string;
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
class AefiSideEffects {
	@IsNotEmpty()
	@ApiProperty({ example: '390dmi14d' })
	dataElement: string;
	@Optional()
	@IsString()
	@ApiProperty({ example: '390dmi14d' })
	value?: string;
}
