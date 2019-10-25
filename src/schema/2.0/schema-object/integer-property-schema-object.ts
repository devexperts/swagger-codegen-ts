import { stringOption } from '../../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';
import { literal, type } from 'io-ts';

export interface IntegerPropertySchemaObject {
	readonly type: 'integer';
	readonly format: Option<string>;
}

export const IntegerPropertySchemaObject = type(
	{
		type: literal('integer'),
		format: stringOption,
	},
	'IntegerPropertySchemaObject',
);
