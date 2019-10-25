import { stringOption } from '../../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';
import { literal, type } from 'io-ts';

export interface NumberPropertySchemaObject {
	readonly type: 'number';
	readonly format: Option<string>;
}

export const NumberPropertySchemaObject = type(
	{
		type: literal('number'),
		format: stringOption,
	},
	'NumberPropertySchemaObject',
);
