import { stringOption } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ContactObject } from './contact-object';
import { LicenseObject } from './license-object';
import { Option } from 'fp-ts/lib/Option';
import { string, type } from 'io-ts';

export interface InfoObject {
	readonly title: string;
	readonly description: Option<string>;
	readonly termsOfService: Option<string>;
	readonly contact: Option<ContactObject>;
	readonly license: Option<LicenseObject>;
	readonly version: string;
}

export const InfoObject = type(
	{
		title: string,
		description: stringOption,
		termsOfService: stringOption,
		contact: optionFromNullable(ContactObject),
		license: optionFromNullable(LicenseObject),
		version: string,
	},
	'InfoObject',
);
