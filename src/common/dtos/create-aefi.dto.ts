import { IsNotEmpty, IsOptional, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAefiDto {
	@ArrayNotEmpty()
	@ApiProperty({ example: [{ dataElement: 'exAlKwep7t', value: true }] })
	aefiSideEffects: aefiSideEffect[];
	@IsOptional()
	@IsNotEmpty()
	@ApiProperty({ nullable: true, example: 'Pain in abdomen' })
	aefiOtherSideEffects?: string;
	@IsNotEmpty()
	@ApiProperty({ example: 'High Blood Pressure' })
	medicalHistory: string;
	@IsNotEmpty()
	@ApiProperty({ example: 'bvS3GVQAlj' })
	aefiSeverityId: string;
	@IsNotEmpty()
	@ApiProperty({ example: 'op90Imdoaw' })
	trackedEntityInstanceId: string;
	@IsNotEmpty()
	@ApiProperty({ example: 'o78jf8j29r' })
	orgUnitId: string;
}

export class aefiSideEffect {
	@IsNotEmpty()
	@ApiProperty({ example: '3cjEwgh5UL' })
	dataElement: string;
	@IsNotEmpty()
	@ApiProperty({ example: 'Yes' })
	value: string;
}
