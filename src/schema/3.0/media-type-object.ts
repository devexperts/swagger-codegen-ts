import { type, union } from 'io-ts';
import { SchemaObject, SchemaObjectCodec } from './schema-object';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface MediaTypeObject {
	readonly schema: Option<SchemaObject | ReferenceObject>;
}

export const MediaTypeObjectCodec: Codec<MediaTypeObject> = type(
	{
		schema: optionFromNullable(union([ReferenceObjectCodec, SchemaObjectCodec])),
	},
	'MediaTypeObject',
);
