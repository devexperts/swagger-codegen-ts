import { BlendMode, BlendModeCodec } from '../enums/blend-mode';
import { Codec } from '../../../utils/io-ts';
import { number, type } from 'io-ts';

export interface GraphicsContextSettings {
	readonly blendMode: BlendMode;
	readonly opacity: number;
}

export const GraphicsContextSettingsCodec: Codec<GraphicsContextSettings> = type(
	{
		blendMode: BlendModeCodec,
		opacity: number,
	},
	'GraphicsContextSettings',
);
