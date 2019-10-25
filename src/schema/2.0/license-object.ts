import { Option } from 'fp-ts/lib/Option';
import { stringOption } from '../../utils/io-ts';
import { string, type } from 'io-ts';

export interface LicenseObject {
	readonly name: string;
	readonly url: Option<string>;
}

export const LicenseObject = type(
	{
		name: string,
		url: stringOption,
	},
	'LicenseObject',
);
