export interface Parser {
	(buffer: Buffer): { [key: string]: unknown };
}
