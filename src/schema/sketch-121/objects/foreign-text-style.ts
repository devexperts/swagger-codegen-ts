import { Codec } from '../../../utils/io-ts';
import { string, type } from 'io-ts';
import { SharedStyle, SharedStyleCodec } from './shared-style';

export interface ForeignTextStyle {
	readonly sourceLibraryName: string;
	readonly localSharedStyle: SharedStyle;
}

export const ForeignTextStyleCodec: Codec<ForeignTextStyle> = type(
	{
		sourceLibraryName: string,
		localSharedStyle: SharedStyleCodec,
	},
	'ForeignTextStyle',
);
