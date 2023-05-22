import { Color } from './color';
import { Codec } from '../../../utils/io-ts';
export interface InnerShadow {
    readonly isEnabled: boolean;
    readonly blurRadius: number;
    readonly color: Color;
    readonly offsetX: number;
    readonly offsetY: number;
    readonly spread: number;
}
export declare const InnerShadowCodec: Codec<InnerShadow>;
