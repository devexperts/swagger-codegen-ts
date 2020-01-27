import { string, type } from 'io-ts';
import { Codec } from '../../../utils/io-ts';

export interface OverrideValue {
	readonly _class: string;
	readonly overrideName: string;
	readonly value: string;
}

export const OverrideValueCodec: Codec<OverrideValue> = type(
	{
		_class: string,
		value: string,
		overrideName: string,
	},
	'OverrideValue',
);
