import { Codec } from '../../../utils/io-ts';
import { Color } from './color';
export interface Shadow {
    readonly isEnabled: boolean;
    readonly blurRadius: number;
    readonly color: Color;
    readonly offsetX: number;
    readonly offsetY: number;
    readonly spread: number;
}
export declare const ShadowCodec: Codec<Shadow>;
