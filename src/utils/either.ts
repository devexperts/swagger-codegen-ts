import { array } from 'fp-ts/lib/Array';
import { Either, either, left, right } from 'fp-ts/lib/Either';
import { sequenceT } from 'fp-ts/lib/Apply';
import { isNullable, Nullable } from './nullable';

export const sequenceEither = array.sequence(either);
export const sequenceTEither = sequenceT(either);
export const fromNullable = <E>(e: () => E) => <A>(na: Nullable<A>): Either<E, A> =>
	isNullable(na) ? left(e()) : right(na);
