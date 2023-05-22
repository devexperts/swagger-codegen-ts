import { Codec } from '../../../utils/io-ts';
import { TextVerticalAlignment } from '../enums/text-vertical-alignment';
import { FontDescriptor } from './font-descriptor';
import { Option } from 'fp-ts/lib/Option';
import { ParagraphStyle } from './paragraph-style';
import { UnderlineStyle } from '../enums/underline-style';
import { TextTransform } from '../enums/text-transform';
import { Color } from './color';
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
export declare const TextStyleCodec: Codec<TextStyle>;
