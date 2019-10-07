import { Option } from 'fp-ts/lib/Option';
import { booleanOption, numberOption, primitiveArrayOption, stringOption } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import * as t from 'io-ts';

export interface BaseItemsObject {
	readonly format: Option<string>;
	readonly collectionFormat: Option<'csv' | 'ssv' | 'tsv' | 'pipes'>;
	readonly maximum: Option<number>;
	readonly exclusiveMaximum: Option<boolean>;
	readonly minimum: Option<number>;
	readonly exclusiveMinimum: Option<boolean>;
	readonly maxLength: Option<number>;
	readonly minLength: Option<number>;
	readonly pattern: Option<string>;
	readonly maxItems: Option<number>;
	readonly minItems: Option<number>;
	readonly uniqueItems: Option<boolean>;
	readonly enum: Option<Array<string | number | boolean>>;
	readonly multipleOf: Option<number>;
}

export const BaseItemsObjectProps = {
	format: stringOption,
	collectionFormat: optionFromNullable(
		t.union([t.literal('csv'), t.literal('ssv'), t.literal('tsv'), t.literal('pipes')]),
	),
	maximum: numberOption,
	exclusiveMaximum: booleanOption,
	minimum: numberOption,
	exclusiveMinimum: booleanOption,
	maxLength: numberOption,
	minLength: numberOption,
	pattern: stringOption,
	maxItems: numberOption,
	minItems: numberOption,
	uniqueItems: booleanOption,
	enum: primitiveArrayOption,
	multipleOf: numberOption,
};

export interface StringItemsObject extends BaseItemsObject {
	readonly type: 'string';
}

export const StringItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('string'),
	},
	'StringItemsObject',
);

export interface NumberItemsObject extends BaseItemsObject {
	readonly type: 'number';
}

export const NumberItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('number'),
	},
	'NumberItemsObject',
);

export interface IntegerItemsObject extends BaseItemsObject {
	readonly type: 'integer';
}

export const IntegerItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('integer'),
	},
	'IntegerItemsObject',
);

export interface BooleanItemsObject extends BaseItemsObject {
	readonly type: 'boolean';
}

export const BooleanItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('boolean'),
	},
	'BooleanItemsObject',
);

export type NonArrayItemsObject = StringItemsObject | NumberItemsObject | IntegerItemsObject | BooleanItemsObject;

export const NonArrayItemsObject = t.union(
	[StringItemsObject, NumberItemsObject, IntegerItemsObject, BooleanItemsObject],
	'NonArrayItemsObject',
);

export type ItemsObject =
	| ArrayItemsObject
	| StringItemsObject
	| NumberItemsObject
	| IntegerItemsObject
	| BooleanItemsObject;
export const ItemsObject = t.recursion<ItemsObject>('ItemsObject', ItemsObject => {
	const ArrayItemsObject = t.type({
		...BaseItemsObjectProps,
		type: t.literal('array'),
		items: optionFromNullable(t.array(ItemsObject)),
	});
	return t.union([
		ArrayItemsObject,
		StringItemsObject,
		NumberItemsObject,
		IntegerItemsObject,
		BooleanItemsObject,
	]) as any;
});

export interface ArrayItemsObject extends BaseItemsObject {
	readonly type: 'array';
	readonly items: Option<ItemsObject[]>;
}
