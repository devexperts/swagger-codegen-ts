import { Option } from 'fp-ts/lib/Option';
import { primitiveArrayOption, stringOption } from '../../../utils/io-ts';
import { literal, type } from 'io-ts';

export interface StringPropertySchemaObject {
	readonly type: 'string';
	readonly format: Option<string>;
	readonly enum: Option<Array<string | number | boolean>>;
}

export const StringPropertySchemaObject = type(
	{
		type: literal('string'),
		format: stringOption,
		enum: primitiveArrayOption,
	},
	'StringPropertySchemaObject',
);
