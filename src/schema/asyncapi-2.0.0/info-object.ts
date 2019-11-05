import { Option } from 'fp-ts/lib/Option';
import { ContactObject, ContactObjectCodec } from './contact-object';
import { LicenseObject, LicenseObjectCodec } from './license-object';
import { Codec } from '../../utils/io-ts';
import { string, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface InfoObject {
	readonly title: string;
	readonly version: string;
	readonly description: Option<string>;
	readonly termsOfService: Option<string>;
	readonly contact: Option<ContactObject>;
	readonly license: Option<LicenseObject>;
}

export const InfoObjectCodec: Codec<InfoObject> = type(
	{
		title: string,
		version: string,
		description: optionFromNullable(string),
		termsOfService: optionFromNullable(string),
		contact: optionFromNullable(ContactObjectCodec),
		license: optionFromNullable(LicenseObjectCodec),
	},
	'InfoObject',
);
