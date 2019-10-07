import { Option } from 'fp-ts/lib/Option';
import { booleanOption, numberOption, primitiveArrayOption, stringOption } from '../../../utils/io-ts';
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
