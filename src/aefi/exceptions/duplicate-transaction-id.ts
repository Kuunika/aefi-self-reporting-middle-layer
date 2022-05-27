export class DuplicateTransactionIdError extends Error {
	constructor(id: string) {
		super(`Duplicate transaction id: ${id}`);
	}
}
