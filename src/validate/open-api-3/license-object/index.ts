import { Option } from 'fp-ts/lib/Option';
import { string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#licenseObject
export type LicenseObject = {
	name: string;
	url: Option<string>;
};
export const licenseObjectIO = type(
	{
		name: string,
		url: createOptionFromNullable(string),
	},
	'LicenseObject',
);
