import { Monad1 } from 'fp-ts/lib/Monad';
import { constUndefined, identity, Predicate } from 'fp-ts/lib/function';
import { pipeable } from 'fp-ts/lib/pipeable';
import { Filterable1 } from 'fp-ts/lib/Filterable';
import { isSome, toUndefined } from 'fp-ts/lib/Option';
import { isLeft, isRight } from 'fp-ts/lib/Either';
import { Separated } from 'fp-ts/lib/Compactable';
import { Alternative1 } from 'fp-ts/lib/Alternative';
import { sequenceT } from 'fp-ts/lib/Apply';

export type Nullable<A> = A | null | undefined;

declare module 'fp-ts/lib/HKT' {
	interface URItoKind<A> {
		Nullable: Nullable<A>;
	}
}

export const isNullable = <A>(a: Nullable<A>): a is undefined | null => a === undefined || a === null;
export const isNonNullable = <A>(a: Nullable<A>): a is NonNullable<A> => a !== undefined && a !== null;

export const nullable: Monad1<'Nullable'> & Filterable1<'Nullable'> & Alternative1<'Nullable'> = {
	URI: 'Nullable',
	map: (fa, f) => (isNonNullable(fa) ? f(fa) : undefined),
	of: identity,
	ap: (fab, fa) => (isNonNullable(fab) && isNonNullable(fa) ? fab(fa) : undefined),
	chain: (fa, f) => (isNonNullable(fa) ? f(fa) : undefined),
	compact: fa => (isNonNullable(fa) && isSome(fa) ? fa.value : undefined),
	separate: fa =>
		isNonNullable(fa)
			? { left: isLeft(fa) ? fa.left : undefined, right: isRight(fa) ? fa.right : undefined }
			: { left: undefined, right: undefined },
	filter: <A>(fa: Nullable<A>, predicate: Predicate<A>): Nullable<A> =>
		isNonNullable(fa) && predicate(fa) ? fa : undefined,
	filterMap: (fa, f) => (isNullable(fa) ? undefined : toUndefined(f(fa))),
	partition: <A>(fa: Nullable<A>, predicate: Predicate<A>): Separated<Nullable<A>, Nullable<A>> => ({
		left: nullable.filter(fa, a => !predicate(a)),
		right: nullable.filter(fa, predicate),
	}),
	partitionMap: (fa, f) => nullable.separate(nullable.map(fa, f)),
	zero: constUndefined,
	alt: (fx, fy) => (isNonNullable(fx) ? fx : fy()),
};

const {
	ap,
	apFirst,
	apSecond,
	chain,
	chainFirst,
	flatten,
	map,
	compact,
	filter,
	filterMap,
	partition,
	partitionMap,
	separate,
	alt,
} = pipeable(nullable);
export {
	ap,
	apFirst,
	apSecond,
	chain,
	chainFirst,
	flatten,
	map,
	compact,
	filter,
	filterMap,
	partition,
	partitionMap,
	separate,
	alt,
};

export const compactNullables = <A>(as: Nullable<A>[]): A[] => as.filter(isNonNullable);

export const getOrElse = <A>(a: () => A) => (na: Nullable<A>): A => (isNonNullable(na) ? na : a());
export const fold = <A, B>(onUndefined: () => B, onValue: (a: A) => B) => (na: Nullable<A>): B =>
	isNonNullable(na) ? onValue(na) : onUndefined();
export const tryCatch = <A>(thunk: () => A): Nullable<A> => {
	try {
		return thunk();
	} catch {
		return undefined;
	}
};
export const sequenceTNullable = sequenceT(nullable);
