import { boolean, intersection, literal, partial, record, string, Type, type, union } from 'io-ts';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { SchemaObject, SchemaObjectCodec } from './schema-object';
import { MediaTypeObject, MediaTypeObjectCodec } from './media-type-object';

export interface BaseParameterObject {
	readonly name: string;
	readonly description?: string;
	readonly deprecated?: boolean;
	readonly schema?: ReferenceObject | SchemaObject;
	readonly content?: Record<string, MediaTypeObject>;
}
const BaseParameterObjectCodecProps = {
	name: string,
};
const BasePartialParameterObjectCodecProps = {
	description: string,
	deprecated: boolean,
	schema: union([ReferenceObjectCodec, SchemaObjectCodec]),
	content: record(string, MediaTypeObjectCodec),
};

export interface PathParameterObject extends BaseParameterObject {
	readonly in: 'path';
	readonly required: true;
}

const PathParameterObjectCodec: Type<PathParameterObject> = intersection(
	[
		type({
			...BaseParameterObjectCodecProps,
			in: literal('path'),
			required: literal(true),
		}),
		partial(BasePartialParameterObjectCodecProps),
	],
	'PathParameterObject',
);

export interface HeaderParameterObject extends BaseParameterObject {
	readonly in: 'header';
	readonly required?: boolean;
}

const HeaderParameterObjectCodec: Type<HeaderParameterObject> = intersection(
	[
		type({
			...BaseParameterObjectCodecProps,
			in: literal('header'),
		}),
		partial({
			...BasePartialParameterObjectCodecProps,
			required: boolean,
		}),
	],
	'HeaderParameterObject',
);

export interface QueryParameterObject extends BaseParameterObject {
	readonly in: 'query';
	readonly required?: boolean;
}

const QueryParameterObjectCodec: Type<QueryParameterObject> = intersection(
	[
		type({
			...BaseParameterObjectCodecProps,
			in: literal('query'),
		}),
		partial({
			...BasePartialParameterObjectCodecProps,
			required: boolean,
		}),
	],
	'QueryParameterObject',
);

export interface CookieParameterObject extends BaseParameterObject {
	readonly in: 'cookie';
	readonly required?: boolean;
}

const CookieParameterObjectCodec: Type<CookieParameterObject> = intersection(
	[
		type({
			...BaseParameterObjectCodecProps,
			in: literal('cookie'),
		}),
		partial({
			...BasePartialParameterObjectCodecProps,
			required: boolean,
		}),
	],
	'CookieParameterObject',
);

export type ParameterObject =
	| PathParameterObject
	| HeaderParameterObject
	| QueryParameterObject
	| CookieParameterObject;

export const ParameterObjectCodec: Type<ParameterObject> = union(
	[PathParameterObjectCodec, HeaderParameterObjectCodec, QueryParameterObjectCodec, CookieParameterObjectCodec],
	'ParameterObject',
);
