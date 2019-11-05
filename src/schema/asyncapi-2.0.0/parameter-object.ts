import { Option } from 'fp-ts/lib/Option';
import { SchemaObject, SchemaObjectCodec } from './schema-object';
import { Codec } from '../../utils/io-ts';
import { string, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface ParameterObject {
	readonly description: Option<string>;
	readonly schema: Option<SchemaObject>;
	readonly location: Option<string>;
}

export const ParameterObjectCodec: Codec<ParameterObject> = type(
	{
		description: optionFromNullable(string),
		schema: optionFromNullable(SchemaObjectCodec),
		location: optionFromNullable(string),
	},
	'ParameterObject',
);
