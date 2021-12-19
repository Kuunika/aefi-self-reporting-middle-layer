import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAefiDto {
	@IsNotEmpty()
	@ApiProperty({ example: ['exAlKwep7t', '3cjEwgh5UL'] })
	aefiSideEffects: string[];
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
}
