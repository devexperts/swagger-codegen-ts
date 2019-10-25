import { Option } from 'fp-ts/lib/Option';
import { booleanOption, stringOption } from '../../../utils/io-ts';
import { literal, string, type } from 'io-ts';

export interface HeaderParameterObject {
	readonly name: string;
	readonly in: 'header';
	readonly description: Option<string>;
	readonly required: Option<boolean>;
}

export const HeaderParameterObject = type(
	{
		name: string,
		in: literal('header'),
		description: stringOption,
		required: booleanOption,
	},
	'HeaderParameterObject',
);
