import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { string, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface ContactObject {
	readonly name: Option<string>;
	readonly url: Option<string>;
	readonly email: Option<string>;
}

export const ContactObjectCodec: Codec<ContactObject> = type(
	{
		name: optionFromNullable(string),
		url: optionFromNullable(string),
		email: optionFromNullable(string),
	},
	'ContactObject',
);
