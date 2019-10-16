import { Arbitrary, array } from 'fast-check';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export const nonEmptyArray = <A>(a: Arbitrary<A>, maxLength: number = 10): Arbitrary<NonEmptyArray<A>> =>
	array(a, 1, maxLength) as any;
