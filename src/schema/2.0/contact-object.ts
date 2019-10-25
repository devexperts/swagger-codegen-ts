import { Option } from 'fp-ts/lib/Option';
import { stringOption } from '../../utils/io-ts';
import { type } from 'io-ts';

export interface ContactObject {
	readonly name: Option<string>;
	readonly url: Option<string>;
	readonly email: Option<string>;
}

export const ContactObject = type(
	{
		name: stringOption,
		url: stringOption,
		email: stringOption,
	},
	'ContactObject',
);
