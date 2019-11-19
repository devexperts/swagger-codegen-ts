import { Codec } from '../../../utils/io-ts';
import { number, type } from 'io-ts';
import { TextVerticalAlignment, TextVerticalAlignmentCodec } from '../enums/text-vertical-alignment';
import { FontDescriptor, FontDescriptorCodec } from './font-descriptor';
import { Option } from 'fp-ts/lib/Option';
import { ParagraphStyle, ParagraphStyleCodec } from './paragraph-style';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { UnderlineStyle, UnderlineStyleCodec } from '../enums/underline-style';
import { TextTransform, TextTransformCodec } from '../enums/text-transform';
import { Color, ColorCodec } from './color';

export interface TextStyle {
	readonly verticalAlignment: TextVerticalAlignment;
	readonly encodedAttributes: {
		readonly paragraphStyle: Option<ParagraphStyle>;
		readonly MSAttributedStringTextTransformAttribute: Option<TextTransform>;
		readonly underlineStyle: Option<UnderlineStyle>;
		readonly kerning: Option<number>;
		readonly MSAttributedStringFontAttribute: FontDescriptor;
		readonly MSAttributedStringColorAttribute: Option<Color>;
	};
}

export const TextStyleCodec: Codec<TextStyle> = type(
	{
		verticalAlignment: TextVerticalAlignmentCodec,
		encodedAttributes: type({
			paragraphStyle: optionFromNullable(ParagraphStyleCodec),
			MSAttributedStringTextTransformAttribute: optionFromNullable(TextTransformCodec),
			underlineStyle: optionFromNullable(UnderlineStyleCodec),
			kerning: optionFromNullable(number),
			MSAttributedStringFontAttribute: FontDescriptorCodec,
			MSAttributedStringColorAttribute: optionFromNullable(ColorCodec),
		}),
	},
	'TextStyle',
);
