import { IsOptional } from 'class-validator';

export class FindClientQueryString {
	@IsOptional()
	phone_number?: string;
	@IsOptional()
	epi_number?: string;
}
