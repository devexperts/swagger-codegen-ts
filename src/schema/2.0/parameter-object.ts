import { boolean, literal, string, type, union } from 'io-ts';
import { Codec } from '../../utils/io-ts';
import { SchemaObject, SchemaObjectCodec } from './schema-object';
import { Option } from 'fp-ts/lib/Option';
import { ItemsObject, ItemsObjectCodec } from './items-object';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface BaseParameterObject {
	readonly required: Option<boolean>;
	readonly name: string;
	readonly description: Option<string>;
}

const BaseParameterObjectProps = {
	required: optionFromNullable(boolean),
	name: string,
	description: optionFromNullable(string),
};

export type ArrayParameterObjectCollectionFormat = 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi';
export interface BaseArrayParameterObject {
	readonly type: 'array';
	readonly items: ItemsObject;
	readonly collectionFormat: Option<ArrayParameterObjectCollectionFormat>;
}

const BaseArrayParameterObjectProps = {
	type: literal('array'),
	items: ItemsObjectCodec,
	collectionFormat: optionFromNullable(
		union([literal('csv'), literal('ssv'), literal('tsv'), literal('pipes'), literal('multi')]),
	),
};

export interface BaseNonArrayParameterObject {
	readonly type: 'string' | 'number' | 'integer' | 'boolean';
	readonly format: Option<string>;
}

const BaseNonArrayParameterObjectProps = {
	type: union([literal('string'), literal('number'), literal('integer'), literal('boolean')]),
	format: optionFromNullable(string),
};

export interface BodyParameterObject extends BaseParameterObject {
	readonly in: 'body';
	readonly schema: SchemaObject;
}
const BodyParameterObjectCodec: Codec<BodyParameterObject> = type(
	{
		...BaseParameterObjectProps,
		in: literal('body'),
		schema: SchemaObjectCodec,
	},
	'BodyParameterObject',
);

export interface BaseFormDataParameterObject extends BaseParameterObject {
	readonly in: 'formData';
}
const BaseFormDataParameterObjectProps = {
	...BaseParameterObjectProps,
	in: literal('formData'),
};
export interface ArrayFormDataParameterObject extends BaseFormDataParameterObject, BaseArrayParameterObject {}
const ArrayFormDataParameterObjectCodec: Codec<ArrayFormDataParameterObject> = type({
	...BaseFormDataParameterObjectProps,
	...BaseArrayParameterObjectProps,
});
export interface NonArrayFormDataParameterObject
	extends BaseFormDataParameterObject,
		Omit<BaseNonArrayParameterObject, 'type'> {
	readonly type: 'string' | 'number' | 'integer' | 'boolean' | 'file';
}
const NonArrayFormDataParameterObjectCodec: Codec<NonArrayFormDataParameterObject> = type({
	...BaseFormDataParameterObjectProps,
	...BaseNonArrayParameterObjectProps,
	type: union([literal('string'), literal('number'), literal('integer'), literal('boolean'), literal('file')]),
});
export type FormDataParameterObject = ArrayFormDataParameterObject | NonArrayFormDataParameterObject;
const FormDataParameterObjectCodec: Codec<FormDataParameterObject> = union([
	ArrayFormDataParameterObjectCodec,
	NonArrayFormDataParameterObjectCodec,
]);

export interface BaseQueryParameterObject extends BaseParameterObject {
	readonly in: 'query';
}
const BaseQueryParameterObjectProps = {
	...BaseParameterObjectProps,
	in: literal('query'),
};
export interface ArrayQueryParameterObject extends BaseQueryParameterObject, BaseArrayParameterObject {}
export const ArrayQueryParameterObjectCodec: Codec<ArrayQueryParameterObject> = type({
	...BaseQueryParameterObjectProps,
	...BaseArrayParameterObjectProps,
});
export interface NonArrayQueryParameterObject extends BaseQueryParameterObject, BaseNonArrayParameterObject {}
const NonArrayQueryHeaderPathParameterObjectCodec: Codec<NonArrayQueryParameterObject> = type({
	...BaseQueryParameterObjectProps,
	...BaseNonArrayParameterObjectProps,
});
export type QueryParameterObject = ArrayQueryParameterObject | NonArrayQueryParameterObject;
const QueryParameterObjectCodec: Codec<QueryParameterObject> = union([
	ArrayQueryParameterObjectCodec,
	NonArrayQueryHeaderPathParameterObjectCodec,
]);

export interface BasePathParameterObject extends Omit<BaseParameterObject, 'required'> {
	readonly in: 'path';
	readonly required: true;
}
const BasePathParameterObjectProps = {
	...BaseParameterObjectProps,
	in: literal('path'),
	required: literal(true),
};
export interface ArrayPathParameterObject extends BasePathParameterObject, BaseArrayParameterObject {}
const ArrayPathParameterObjectCodec: Codec<ArrayPathParameterObject> = type({
	...BasePathParameterObjectProps,
	...BaseArrayParameterObjectProps,
});
export interface NonArrayPathParameterObject extends BasePathParameterObject, BaseNonArrayParameterObject {}
const NonArrayPathParameterObjectCodec: Codec<NonArrayPathParameterObject> = type({
	...BasePathParameterObjectProps,
	...BaseNonArrayParameterObjectProps,
});
export type PathParameterObject = ArrayPathParameterObject | NonArrayPathParameterObject;
const PathParameterObjectCodec: Codec<PathParameterObject> = union([
	ArrayPathParameterObjectCodec,
	NonArrayPathParameterObjectCodec,
]);

export interface BaseHeaderParameterObject extends BaseParameterObject {
	readonly in: 'header';
}
const BaseHeaderParameterObjectProps = {
	...BaseParameterObjectProps,
	in: literal('header'),
};
export interface ArrayHeaderParameterObject extends BaseHeaderParameterObject, BaseArrayParameterObject {}
const ArrayHeaderParameterObjectCodec: Codec<ArrayHeaderParameterObject> = type({
	...BaseHeaderParameterObjectProps,
	...BaseArrayParameterObjectProps,
});
export interface NonArrayHeaderParameterObject extends BaseHeaderParameterObject, BaseNonArrayParameterObject {}
const NonArrayHeaderParameterObjectCodec: Codec<NonArrayHeaderParameterObject> = type({
	...BaseHeaderParameterObjectProps,
	...BaseNonArrayParameterObjectProps,
});
export type HeaderParameterObject = ArrayHeaderParameterObject | NonArrayHeaderParameterObject;
const HeaderParameterObjectCodec: Codec<HeaderParameterObject> = union([
	ArrayHeaderParameterObjectCodec,
	NonArrayHeaderParameterObjectCodec,
]);

export type ParameterObject =
	| BodyParameterObject
	| FormDataParameterObject
	| QueryParameterObject
	| PathParameterObject
	| HeaderParameterObject;
export const ParameterObjectCodec: Codec<ParameterObject> = union(
	[
		BodyParameterObjectCodec,
		FormDataParameterObjectCodec,
		QueryParameterObjectCodec,
		PathParameterObjectCodec,
		HeaderParameterObjectCodec,
	],
	'ParameterObject',
);
