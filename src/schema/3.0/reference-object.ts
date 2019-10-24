import { string, type } from 'io-ts';
import { Codec } from '../../utils/io-ts';

export interface ReferenceObject {
	readonly $ref: string;
}

export const ReferenceObjectCodec: Codec<ReferenceObject> = type(
	{
		$ref: string,
	},
	'ReferenceObject',
);
