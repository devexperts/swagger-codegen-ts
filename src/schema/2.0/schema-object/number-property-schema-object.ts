import * as t from 'io-ts';
import { stringOption } from '../../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';

export interface NumberPropertySchemaObject {
	readonly type: 'number';
	readonly format: Option<string>;
}

export const NumberPropertySchemaObject = t.type(
	{
		type: t.literal('number'),
		format: stringOption,
	},
	'NumberPropertySchemaObject',
);
