import { partial, Type, union } from 'io-ts';
import { SchemaObject, SchemaObjectCodec } from './schema-object';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';

export interface MediaTypeObject {
	readonly schema?: SchemaObject | ReferenceObject;
}

export const MediaTypeObjectCodec: Type<MediaTypeObject> = partial(
	{
		schema: union([ReferenceObjectCodec, SchemaObjectCodec]),
	},
	'MediaTypeObject',
);
