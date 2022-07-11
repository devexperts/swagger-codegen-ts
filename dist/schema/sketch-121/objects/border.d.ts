import { Codec, NonNegative } from '../../../utils/io-ts';
import { Color } from './color';
import { FillType } from '../enums/fill-type';
import { BorderPosition } from '../enums/border-position';
import { GraphicsContextSettings } from './graphics-context-settings';
import { Gradient } from './gradient';
export interface Border {
    readonly isEnabled: boolean;
    readonly color: Color;
    readonly fillType: FillType;
    readonly position: BorderPosition;
    readonly thickness: NonNegative;
    readonly contextSettings: GraphicsContextSettings;
    readonly gradient: Gradient;
}
export declare const BorderCodec: Codec<Border>;
