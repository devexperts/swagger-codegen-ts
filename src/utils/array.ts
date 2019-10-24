import { uniq } from 'fp-ts/lib/Array';
import { eqString } from 'fp-ts/lib/Eq';

export const uniqString = uniq(eqString);
export const concatIfL = <A>(condition: boolean, as: A[], a: (as: A[]) => A[]): A[] =>
	condition ? as.concat(a(as)) : as;
export const concatIf = <A>(condition: boolean, as: A[], a: A[]): A[] => concatIfL(condition, as, () => a);
export const includes = <A>(a: A) => (as: A[]): boolean => as.includes(a);
export const join = (s: string) => <A>(as: string[]): string => as.join(s);
