import { Codec } from '../../../utils/io-ts';
import { string, type } from 'io-ts';
import { SharedStyle, SharedStyleCodec } from './shared-style';

export interface ForeignLayerStyle {
	readonly sourceLibraryName: string;
	readonly localSharedStyle: SharedStyle;
}

export const ForeignLayerStyleCodec: Codec<ForeignLayerStyle> = type(
	{
		sourceLibraryName: string,
		localSharedStyle: SharedStyleCodec,
	},
	'ForeignLayerStyle',
);
