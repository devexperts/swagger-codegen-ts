import { TextHorizontalAlignment, TextHorizontalAlignmentCodec } from '../enums/text-horizontal-alignment';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../../utils/io-ts';
import { number, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface ParagraphStyle {
	readonly alignment: Option<TextHorizontalAlignment>;
	readonly maximumLineHeight: Option<number>;
	readonly minimumLineHeight: Option<number>;
}

export const ParagraphStyleCodec: Codec<ParagraphStyle> = type({
	alignment: optionFromNullable(TextHorizontalAlignmentCodec),
	maximumLineHeight: optionFromNullable(number),
	minimumLineHeight: optionFromNullable(number),
});
