import * as t from 'io-ts';
import { NonArrayItemsObject } from '../items-object';
import { BaseParameterObjectProps } from './base-parameter-object';
import { Option } from 'fp-ts/lib/Option';
import { stringOption } from '../../../utils/io-ts';

export interface BasePathParameterObjectProps extends BaseParameterObjectProps {
	readonly in: 'path';
	readonly required: true;
	readonly format: Option<string>;
}

const BasePathParameterObjectProps = {
	...BaseParameterObjectProps,
	in: t.literal('path'),
	required: t.literal(true),
	format: stringOption,
};

export interface StringPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'string';
}

const StringPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('string'),
	},
	'StringPathParameterObject',
);

export interface NumberPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'number';
}

const NumberPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('number'),
	},
	'NumberPathParameterObject',
);

export interface IntegerPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'integer';
}

const IntegerPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('integer'),
	},
	'IntegerPathParameterObject',
);

export interface BooleanPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'boolean';
}

const BooleanPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('boolean'),
	},
	'BooleanPathParameterObject',
);

export interface ArrayPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'array';
	readonly items: NonArrayItemsObject;
}

const ArrayPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('array'),
		items: NonArrayItemsObject,
	},
	'ArrayPathParameterObject',
);
export type PathParameterObject =
	| StringPathParameterObject
	| NumberPathParameterObject
	| IntegerPathParameterObject
	| BooleanPathParameterObject
	| ArrayPathParameterObject;
export const PathParameterObject = t.union(
	[
		StringPathParameterObject,
		NumberPathParameterObject,
		IntegerPathParameterObject,
		BooleanPathParameterObject,
		ArrayPathParameterObject,
	],
	'PathParameterObject',
);
