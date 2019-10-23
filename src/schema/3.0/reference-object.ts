import { string, Type, type } from 'io-ts';

export interface ReferenceObject {
	readonly $ref: string;
}

export const ReferenceObjectCodec: Type<ReferenceObject> = type(
	{
		$ref: string,
	},
	'ReferenceObject',
);
