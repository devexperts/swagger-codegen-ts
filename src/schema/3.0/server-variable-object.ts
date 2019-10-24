import { array, string, type } from 'io-ts';
import { Codec } from '../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface ServerVariableObject {
	readonly enum: Option<string[]>;
	readonly default: string;
	readonly description: Option<string>;
}

export const ServerVariableObjectCodec: Codec<ServerVariableObject> = type(
	{
		default: string,
		enum: optionFromNullable(array(string)),
		description: optionFromNullable(string),
	},
	'ServerVariableObject',
);
