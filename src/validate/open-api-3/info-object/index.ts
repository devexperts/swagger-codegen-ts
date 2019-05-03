import { Option } from 'fp-ts/lib/Option';
import { contactObjectIO, ContactObject } from '../contact-object';
import { LicenseObject, licenseObjectIO } from '../license-object';
import { string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#infoObject
export type InfoObject = {
	contact: Option<ContactObject>;
	description: Option<string>;
	license: Option<LicenseObject>;
	termsOfService: Option<string>;
	title: string;
	version: string;
};
export const infoObjectIO = type(
	{
		contact: createOptionFromNullable(contactObjectIO),
		description: createOptionFromNullable(string),
		license: createOptionFromNullable(licenseObjectIO),
		termsOfService: createOptionFromNullable(string),
		title: string,
		version: string,
	},
	'InfoObject',
);
