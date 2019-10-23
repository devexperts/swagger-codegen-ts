import { uniq } from 'fp-ts/lib/Array';
import { eqString } from 'fp-ts/lib/Eq';
import { Nullable } from './nullable';

export const uniqString = uniq(eqString);
export const concatIfL = <A>(condition: boolean, as: A[], a: (as: A[]) => A[]): A[] =>
	condition ? as.concat(a(as)) : as;
export const concatIf = <A>(condition: boolean, as: A[], a: A[]): A[] => concatIfL(condition, as, () => a);
export const last = <A>(as: ArrayLike<A>): Nullable<A> => (as.length === 0 ? undefined : as[as.length - 1]);
export const includes = <A>(a: A) => (as: A[]): boolean => as.includes(a);
export const init = <A>(as: A[]): Nullable<A[]> => (as.length === 0 ? undefined : as.slice(0, as.length - 1));
export const lookup = (i: number) => <A>(as: A[]): Nullable<A> => as[i];
export const join = (s: string) => <A>(as: string[]): string => as.join(s);
