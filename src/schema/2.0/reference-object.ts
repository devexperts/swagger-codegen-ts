import { string, type } from 'io-ts';

export interface ReferenceObject {
	readonly $ref: string;
}

export type Reference<A> = A | ReferenceObject;

export const ReferenceObject = type(
	{
		$ref: string,
	},
	'ReferenceObject',
);
