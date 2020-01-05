import { failure, number, string, type, Type, Validation } from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, option } from 'fp-ts';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { Codec } from '../../../utils/io-ts';
import { NumberFromString } from 'io-ts-types/lib/NumberFromString';

export interface PointString {
	readonly x: number;
	readonly y: number;
}
const pointString = type({
	x: number,
	y: number,
});

const pattern = /^{(\S+), (\S+)}$/;

export const PointStringCodec: Codec<PointString> = new Type<PointString, string, unknown>(
	'PointString',
	(u): u is PointString => pointString.is(u),
	(u, c) =>
		pipe(
			string.validate(u, c),
			either.chain(s => {
				const match = s.match(pattern);
				if (!match) {
					return failure(u, c);
				}
				const x: Validation<number> = pipe(
					array.lookup(1, match),
					option.fold(
						() => failure(u, c),
						x => NumberFromString.validate(x, c),
					),
				);
				const y: Validation<number> = pipe(
					array.lookup(2, match),
					option.fold(
						() => failure(u, c),
						y => NumberFromString.validate(y, c),
					),
				);
				return combineEither(x, y, (x, y) => ({ x, y }));
			}),
		),
	p => `{${p.x}, ${p.y}}`,
);
