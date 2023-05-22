import { UnitInterval } from '../utils/unit-interval';
import { Codec } from '../../../utils/io-ts';
export interface Color {
    readonly alpha: UnitInterval;
    readonly red: UnitInterval;
    readonly green: UnitInterval;
    readonly blue: UnitInterval;
}
export declare const ColorCodec: Codec<Color>;
