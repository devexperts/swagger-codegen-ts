import { brand, Branded } from 'io-ts';
import { Codec, fraction, Fraction } from '../../../utils/io-ts';

export interface UnitIntervalBrand {
	readonly UnitInterval: unique symbol;
}
export type UnitInterval = Branded<Fraction, UnitIntervalBrand>;
export const UnitIntervalCodec: Codec<UnitInterval> = brand(
	fraction,
	(n): n is UnitInterval => n >= 0 && n <= 1,
	'UnitInterval',
);
