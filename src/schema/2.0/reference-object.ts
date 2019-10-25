import { string, type } from 'io-ts';

export interface ReferenceObject {
	readonly $ref: string;
}

export const ReferenceObject = type(
	{
		$ref: string,
	},
	'ReferenceObject',
);
