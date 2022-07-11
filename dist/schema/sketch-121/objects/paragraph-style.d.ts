import { TextHorizontalAlignment } from '../enums/text-horizontal-alignment';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../../utils/io-ts';
export interface ParagraphStyle {
    readonly alignment: Option<TextHorizontalAlignment>;
    readonly maximumLineHeight: Option<number>;
    readonly minimumLineHeight: Option<number>;
}
export declare const ParagraphStyleCodec: Codec<ParagraphStyle>;
