import { Nullable } from './nullable';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { toUndefined } from 'fp-ts/lib/Option';
import { nonEmptyArray } from 'fp-ts';

export const fromArray = <A>(as: A[]): Nullable<NonEmptyArray<A>> => toUndefined(nonEmptyArray.fromArray(as));
