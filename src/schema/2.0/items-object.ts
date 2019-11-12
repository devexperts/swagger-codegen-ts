import { booleanOption, Codec, numberOption, primitiveArrayOption, stringOption } from '../../utils/io-ts';
import { literal, recursion, type, union } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

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

const BaseItemsObjectProps = {
	format: stringOption,
	collectionFormat: optionFromNullable(union([literal('csv'), literal('ssv'), literal('tsv'), literal('pipes')])),
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

export type ArrayItemsObjectCollectionFormat = 'csv' | 'ssv' | 'tsv' | 'pipes';
export interface ArrayItemsObject extends BaseItemsObject {
	readonly type: 'array';
	readonly items: ItemsObject;
	readonly collectionFormat: Option<ArrayItemsObjectCollectionFormat>;
}

const ArrayItemsObjectCodec: Codec<ArrayItemsObject> = recursion('ArrayItemsObject', () =>
	type({
		...BaseItemsObjectProps,
		type: literal('array'),
		items: ItemsObjectCodec,
		collectionFormat: optionFromNullable(union([literal('csv'), literal('ssv'), literal('tsv'), literal('pipes')])),
	}),
);

export interface NonArrayItemsObject extends BaseItemsObject {
	readonly type: 'string' | 'number' | 'integer' | 'boolean';
}

const NonArrayItemsObjectCodec: Codec<NonArrayItemsObject> = type({
	...BaseItemsObjectProps,
	type: union([literal('string'), literal('number'), literal('integer'), literal('boolean')]),
});

export type ItemsObject = ArrayItemsObject | NonArrayItemsObject;

export const ItemsObjectCodec: Codec<ItemsObject> = recursion('ItemsObject', () =>
	union([ArrayItemsObjectCodec, NonArrayItemsObjectCodec]),
);
