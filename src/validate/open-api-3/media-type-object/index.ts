import { Any, record, recursion, RecursiveType, string, type, union, unknown } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { SchemaObject, schemaObjectIO } from '../schema-object';
import { ReferenceObject, referenceObjectIO } from '../reference-object';
import { EncodingObject, encodingObjectIO } from '../encoding-object';
import { createOptionFromNullable } from 'io-ts-types';
import { ExampleObject, exampleObjectIO } from '../example-object';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#mediaTypeObject
export type MediaTypeObject = {
	schema: Option<SchemaObject | ReferenceObject>;
	example: Option<unknown>;
	examples: Option<Record<string, ExampleObject | ReferenceObject>>;
	encoding: Option<Record<string, EncodingObject>>;
};

export const mediaTypeObjectIO: RecursiveType<Any, MediaTypeObject, unknown> = recursion('MediaTypeObject', () =>
	type({
		schema: createOptionFromNullable(union([schemaObjectIO, referenceObjectIO])),
		example: createOptionFromNullable(unknown),
		examples: createOptionFromNullable(record(string, union([exampleObjectIO, referenceObjectIO]))),
		encoding: createOptionFromNullable(record(string, encodingObjectIO)),
	}),
);
