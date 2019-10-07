import * as t from 'io-ts';
import { stringOption } from '../../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';

export interface IntegerPropertySchemaObject {
	readonly type: 'integer';
	readonly format: Option<string>;
}

export const IntegerPropertySchemaObject = t.type(
	{
		type: t.literal('integer'),
		format: stringOption,
	},
	'IntegerPropertySchemaObject',
);
