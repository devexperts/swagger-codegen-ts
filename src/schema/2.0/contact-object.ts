import * as t from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { stringOption } from '../../utils/io-ts';

export interface ContactObject {
	readonly name: Option<string>;
	readonly url: Option<string>;
	readonly email: Option<string>;
}

export const ContactObject = t.type(
	{
		name: stringOption,
		url: stringOption,
		email: stringOption,
	},
	'ContactObject',
);
