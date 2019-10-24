import { record, string, type, union } from 'io-ts';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { SchemaObject, SchemaObjectCodec } from './schema-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface ComponentsObject {
	readonly schemas: Option<Record<string, ReferenceObject | SchemaObject>>;
}

export const ComponentsObjectCodec: Codec<ComponentsObject> = type(
	{
		schemas: optionFromNullable(record(string, union([ReferenceObjectCodec, SchemaObjectCodec]))),
	},
	'ComponentsObject',
);
