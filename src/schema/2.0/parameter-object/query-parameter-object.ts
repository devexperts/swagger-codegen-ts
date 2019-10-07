import { Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import { booleanOption, stringOption } from '../../../utils/io-ts';
import { NonArrayItemsObject } from '../items-object';

export interface BaseQueryParameterObjectProps {
	readonly name: string;
	readonly in: 'query';
	readonly description: Option<string>;
	readonly required: Option<boolean>;
}

export const BaseQueryParameterObjectProps = {
	name: t.string,
	in: t.literal('query'),
	description: stringOption,
	required: booleanOption,
};

export interface StringQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'string';
}

export const StringQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('string'),
	},
	'StringQueryParameterObject',
);

export interface NumberQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'number';
}

export const NumberQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('number'),
	},
	'NumberQueryParameterObject',
);

export interface IntegerQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'integer';
}

export const IntegerQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('integer'),
	},
	'IntegerQueryParameterObject',
);

export interface BooleanQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'boolean';
}

export const BooleanQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('boolean'),
	},
	'BooleanQueryParameterObject',
);

export interface ArrayQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'array';
	readonly items: NonArrayItemsObject;
}

export const ArrayQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('array'),
		items: NonArrayItemsObject,
	},
	'ArrayQueryParameterObject',
);
export type QueryParameterObject =
	| StringQueryParameterObject
	| NumberQueryParameterObject
	| IntegerQueryParameterObject
	| BooleanQueryParameterObject
	| ArrayQueryParameterObject;

export const QueryParameterObject = t.union(
	[
		StringQueryParameterObject,
		NumberQueryParameterObject,
		IntegerQueryParameterObject,
		BooleanQueryParameterObject,
		ArrayQueryParameterObject,
	],
	'QueryParameterObject',
);
