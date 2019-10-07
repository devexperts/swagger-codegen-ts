import { Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import { primitiveArrayOption, stringOption } from '../../../utils/io-ts';

export interface StringPropertySchemaObject {
	readonly type: 'string';
	readonly format: Option<string>;
	readonly enum: Option<Array<string | number | boolean>>;
}

export const StringPropertySchemaObject = t.type(
	{
		type: t.literal('string'),
		format: stringOption,
		enum: primitiveArrayOption,
	},
	'StringPropertySchemaObject',
);
