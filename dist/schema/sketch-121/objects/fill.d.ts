import { Codec } from '../../../utils/io-ts';
import { Color } from './color';
import { Gradient } from './gradient';
import { FillType } from '../enums/fill-type';
import { GraphicsContextSettings } from './graphics-context-settings';
export interface Fill {
    readonly isEnabled: boolean;
    readonly color: Color;
    readonly fillType: FillType;
    readonly contextSettings: GraphicsContextSettings;
    readonly gradient: Gradient;
}
export declare const FillCodec: Codec<Fill>;
