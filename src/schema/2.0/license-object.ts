import { Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import { stringOption } from '../../utils/io-ts';

export interface LicenseObject {
	readonly name: string;
	readonly url: Option<string>;
}

export const LicenseObject = t.type(
	{
		name: t.string,
		url: stringOption,
	},
	'LicenseObject',
);
