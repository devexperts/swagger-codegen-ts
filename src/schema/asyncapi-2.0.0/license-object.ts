import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { string, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface LicenseObject {
	readonly name: string;
	readonly url: Option<string>;
}

export const LicenseObjectCodec: Codec<LicenseObject> = type(
	{
		name: string,
		url: optionFromNullable(string),
	},
	'LicenseObject',
);
