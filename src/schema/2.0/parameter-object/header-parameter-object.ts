import { Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import { booleanOption, stringOption } from '../../../utils/io-ts';

export interface HeaderParameterObject {
	readonly name: string;
	readonly in: 'header';
	readonly description: Option<string>;
	readonly required: Option<boolean>;
}

export const HeaderParameterObject = t.type(
	{
		name: t.string,
		in: t.literal('header'),
		description: stringOption,
		required: booleanOption,
	},
	'HeaderParameterObject',
);
