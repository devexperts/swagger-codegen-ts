import { record, string, type, union } from 'io-ts';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { SchemaObject, SchemaObjectCodec } from './schema-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ParameterObject, ParameterObjectCodec } from './parameter-object';
import { ResponseObject, ResponseObjectCodec } from './response-object';
import { RequestBodyObject, RequestBodyObjectCodec } from './request-body-object';

export interface ComponentsObject {
	readonly schemas: Option<Record<string, ReferenceObject | SchemaObject>>;
	readonly parameters: Option<Record<string, ReferenceObject | ParameterObject>>;
	readonly responses: Option<Record<string, ReferenceObject | ResponseObject>>;
	readonly requestBodies: Option<Record<string, ReferenceObject | RequestBodyObject>>;
}

export const ComponentsObjectCodec: Codec<ComponentsObject> = type(
	{
		schemas: optionFromNullable(record(string, union([ReferenceObjectCodec, SchemaObjectCodec]))),
		parameters: optionFromNullable(record(string, union([ReferenceObjectCodec, ParameterObjectCodec]))),
		responses: optionFromNullable(record(string, union([ReferenceObjectCodec, ResponseObjectCodec]))),
		requestBodies: optionFromNullable(record(string, union([ReferenceObjectCodec, RequestBodyObjectCodec]))),
	},
	'ComponentsObject',
);
