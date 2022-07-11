import { Branded } from 'io-ts';
import { Codec, Fraction } from '../../../utils/io-ts';
export interface UnitIntervalBrand {
    readonly UnitInterval: unique symbol;
}
export declare type UnitInterval = Branded<Fraction, UnitIntervalBrand>;
export declare const UnitIntervalCodec: Codec<UnitInterval>;
