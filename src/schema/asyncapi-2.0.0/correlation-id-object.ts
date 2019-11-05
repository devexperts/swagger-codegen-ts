import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { string, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface CorrelationIdObject {
	readonly description: Option<string>;
	readonly location: string;
}

export const CorrelationIdObjectCodec: Codec<CorrelationIdObject> = type(
	{
		description: optionFromNullable(string),
		location: string,
	},
	'CorrelationIdObject',
);
