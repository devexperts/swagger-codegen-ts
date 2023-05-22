import { Color } from './color';
import { UnitInterval } from '../utils/unit-interval';
import { Codec } from '../../../utils/io-ts';
export interface GradientStop {
    readonly color: Color;
    readonly position: UnitInterval;
}
export declare const GradientStopCodec: Codec<GradientStop>;
