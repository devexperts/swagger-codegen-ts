import { UUID } from 'io-ts-types/lib/UUID';
import { Codec } from '../../../utils/io-ts';
import { array, type } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { Fill, FillCodec } from './fill';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { GraphicsContextSettings, GraphicsContextSettingsCodec } from './graphics-context-settings';
import { Border, BorderCodec } from './border';
import { BorderOptions, BorderOptionsCodec } from './border-options';
import { InnerShadow, InnerShadowCodec } from './inner-shadow';
import { Shadow, ShadowCodec } from './shadow';
import { TextStyle, TextStyleCodec } from './text-style';

export interface Style {
	readonly do_objectID: UUID;
	readonly borders: Option<Border[]>;
	readonly borderOptions: BorderOptions;
	readonly fills: Option<Fill[]>;
	readonly textStyle: Option<TextStyle>;
	readonly shadows: Option<Shadow[]>;
	readonly innerShadows: InnerShadow[];
	readonly contextSettings: Option<GraphicsContextSettings>;
}

export const StyleCodec: Codec<Style> = type(
	{
		do_objectID: UUID,
		borders: optionFromNullable(array(BorderCodec)),
		borderOptions: BorderOptionsCodec,
		fills: optionFromNullable(array(FillCodec)),
		textStyle: optionFromNullable(TextStyleCodec),
		shadows: optionFromNullable(array(ShadowCodec)),
		innerShadows: array(InnerShadowCodec),
		contextSettings: optionFromNullable(GraphicsContextSettingsCodec),
	},
	'Style',
);
