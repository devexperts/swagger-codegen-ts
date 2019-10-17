import { Arbitrary, array } from 'fast-check';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Filterable1 } from 'fp-ts/lib/Filterable';
import { identity, not, Predicate, Refinement } from 'fp-ts/lib/function';
import { isSome } from 'fp-ts/lib/Option';
import { Kind } from 'fp-ts/lib/HKT';
import { Separated } from 'fp-ts/lib/Compactable';
import { isLeft, isRight } from 'fp-ts/lib/Either';
import { pipe, pipeable } from 'fp-ts/lib/pipeable';

declare module 'fp-ts/lib/HKT' {
	interface URItoKind<A> {
		Arbitrary: Arbitrary<A>;
	}
}

export const nonEmptyArray = <A>(a: Arbitrary<A>, maxLength: number = 10): Arbitrary<NonEmptyArray<A>> =>
	array(a, 1, maxLength) as any;

export const arbitraryInstance: Filterable1<'Arbitrary'> = {
	URI: 'Arbitrary',
	map: (fa, f) => fa.map(f),
	filter: <A>(fa: Arbitrary<A>, p: Predicate<A>) => fa.filter(p),
	filterMap: (fa, f) => arbitraryInstance.filter(fa.map(f), isSome).map(o => o.value),
	partition: <A>(fa: Arbitrary<A>, predicate: Predicate<A>): Separated<Arbitrary<A>, Arbitrary<A>> => ({
		left: fa.filter(not(predicate)),
		right: fa.filter(predicate),
	}),
	partitionMap: (fa, f) => ({
		left: arbitraryInstance.filter(fa.map(f), isLeft).map(e => e.left),
		right: arbitraryInstance.filter(fa.map(f), isRight).map(e => e.right),
	}),
	compact: fa => arbitraryInstance.filterMap(fa, identity),
	separate: fa => arbitraryInstance.partitionMap(fa, identity),
};

export const arbitrary = pipeable(arbitraryInstance);
