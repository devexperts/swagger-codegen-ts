import * as t from 'io-ts';

export interface ReferenceObject {
	readonly $ref: string;
}

export const ReferenceObject = t.type(
	{
		$ref: t.string,
	},
	'ReferenceObject',
);
