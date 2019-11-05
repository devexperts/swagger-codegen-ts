import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { array, string, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface ServerVariableObject {
	readonly enum: Option<string[]>;
	readonly default: Option<string>;
	readonly description: Option<string>;
	readonly examples: Option<string[]>;
}

export const ServerVariableObjectCodec: Codec<ServerVariableObject> = type(
	{
		enum: optionFromNullable(array(string)),
		default: optionFromNullable(string),
		description: optionFromNullable(string),
		examples: optionFromNullable(array(string)),
	},
	'ServerVariableObject',
);
