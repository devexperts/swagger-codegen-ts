import { ServerVariableObject, ServerVariableObjectCodec } from './server-variable-object';
import { record, string, type } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { Codec } from '../../utils/io-ts';

export interface ServerObject {
	readonly url: string;
	readonly description: Option<string>;
	readonly variables: Option<Record<string, ServerVariableObject>>;
}

export const ServerObjectCodec: Codec<ServerObject> = type(
	{
		url: string,
		description: optionFromNullable(string),
		variables: optionFromNullable(record(string, ServerVariableObjectCodec)),
	},
	'ServerObject',
);
