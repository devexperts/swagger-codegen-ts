import { boolean, literal, record, string, type, union } from 'io-ts';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { SchemaObject, SchemaObjectCodec } from './schema-object';
import { MediaTypeObject, MediaTypeObjectCodec } from './media-type-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export type ParameterObjectStyle =
	| 'matrix'
	| 'label'
	| 'form'
	| 'simple'
	| 'spaceDelimited'
	| 'pipeDelimited'
	| 'deepObject';

export interface BaseParameterObject {
	readonly name: string;
	readonly description: Option<string>;
	readonly deprecated: Option<boolean>;
	readonly schema: Option<ReferenceObject | SchemaObject>;
	readonly content: Option<Record<string, MediaTypeObject>>;
	readonly explode: Option<boolean>;
	readonly style: Option<ParameterObjectStyle>;
}
const BaseParameterObjectCodecProps = {
	name: string,
	description: optionFromNullable(string),
	deprecated: optionFromNullable(boolean),
	schema: optionFromNullable(union([ReferenceObjectCodec, SchemaObjectCodec])),
	content: optionFromNullable(record(string, MediaTypeObjectCodec)),
	explode: optionFromNullable(boolean),
	style: optionFromNullable(
		union([
			literal('matrix'),
			literal('label'),
			literal('form'),
			literal('simple'),
			literal('spaceDelimited'),
			literal('pipeDelimited'),
			literal('deepObject'),
		]),
	),
};

export interface PathParameterObject extends BaseParameterObject {
	readonly in: 'path';
	readonly required: true;
}

const PathParameterObjectCodec: Codec<PathParameterObject> = type(
	{
		...BaseParameterObjectCodecProps,
		in: literal('path'),
		required: literal(true),
	},
	'PathParameterObject',
);

export interface HeaderParameterObject extends BaseParameterObject {
	readonly in: 'header';
	readonly required: Option<boolean>;
}

const HeaderParameterObjectCodec: Codec<HeaderParameterObject> = type(
	{
		...BaseParameterObjectCodecProps,
		in: literal('header'),
		required: optionFromNullable(boolean),
	},
	'HeaderParameterObject',
);

export interface QueryParameterObject extends BaseParameterObject {
	readonly in: 'query';
	readonly required: Option<boolean>;
}

const QueryParameterObjectCodec: Codec<QueryParameterObject> = type(
	{
		...BaseParameterObjectCodecProps,
		in: literal('query'),
		required: optionFromNullable(boolean),
	},
	'QueryParameterObject',
);

export interface CookieParameterObject extends BaseParameterObject {
	readonly in: 'cookie';
	readonly required: Option<boolean>;
}

const CookieParameterObjectCodec: Codec<CookieParameterObject> = type(
	{
		...BaseParameterObjectCodecProps,
		in: literal('cookie'),
		required: optionFromNullable(boolean),
	},
	'CookieParameterObject',
);

export type ParameterObject =
	| PathParameterObject
	| HeaderParameterObject
	| QueryParameterObject
	| CookieParameterObject;

export const ParameterObjectCodec: Codec<ParameterObject> = union(
	[PathParameterObjectCodec, HeaderParameterObjectCodec, QueryParameterObjectCodec, CookieParameterObjectCodec],
	'ParameterObject',
);
