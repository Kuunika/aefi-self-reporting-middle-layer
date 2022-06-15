import { IsNotEmpty, IsOptional, ArrayNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class ReportAefiDto {
	@ApiProperty({
		example: '628fe08cede7d9a5fa4cd869',
	})
	@IsOptional()
	transactionId?: string;
	@ApiProperty({ example: 'op90Imdoaw' })
	@IsOptional()
	trackedEntityInstance?: string;
	//TODO: need a way to validate the strings, could use cache to help
	@ArrayNotEmpty()
	@ApiProperty({ example: ['exAlKwep7t'] })
	aefiSideEffects: AefiSideEffects[];
	@IsOptional()
	@ApiProperty({ nullable: true, example: 'Pain in abdomen' })
	//TODO: This causes a problem when an empty string is passed, Fix by having the default be 'N/A'
	aefiOtherSideEffects?: string;
	@IsNotEmpty()
	@ApiProperty({ example: 'High Blood Pressure' })
	medicalHistory: string;
	@IsOptional()
	@IsNotEmpty()
	@ApiProperty({ example: 'bvS3GVQAlj' })
	aefiSeverityId: string;
	@IsNotEmpty()
	@ApiProperty({ example: 'o78jf8j29r' })
	orgUnit: string;
	@IsNotEmpty()
	@ApiProperty({ example: '9sj0g30u52' })
	program: string;
	@IsNotEmpty()
	@ApiProperty({ example: '24je045md2' })
	programStage: string;
	@IsOptional()
	@ApiProperty({ example: '24je045md2' })
	vaccineCode?: string;
	@IsOptional()
	@ApiProperty({ example: '24je045md2' })
	vaccinationDate?: string;
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
