import { ApiProperty } from '@nestjs/swagger';

export class ClientFoundDto {
	@ApiProperty({ example: 'John' })
	firstName: string;
	@ApiProperty({ example: 'Doe' })
	surname: string;
	@ApiProperty({ example: 'EPI_000000' })
	epiNumber: string;
	@ApiProperty({ example: '28/7/2021' })
	dateOfNextDosage?: string;
	@ApiProperty({ example: 'Fully Vaccinated' })
	nextDosageMessage?: string;
	@ApiProperty({ example: 'p039dHeid' })
	orgUnit: string;
	@ApiProperty({ example: 'n1mop0dje' })
	program: string;
	@ApiProperty({ example: 'pldkd00143' })
	programStage: string;
	@ApiProperty({ example: 'PARTIAL' })
	vaccinationStatus: string;
	@ApiProperty({ example: '09fmi0dnj34if0f' })
	trackedEntityInstance: string;
}
