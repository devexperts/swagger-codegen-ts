import { Either, left, right } from 'fp-ts/lib/Either';

export type Ref = string & {
	readonly Ref: unique symbol;
};

const refMatcher = /^([^#]*)#\/([^#]+)$/;
export const isRef = (ref: string): ref is Ref => refMatcher.test(ref);
export const fromString = <E>(onFail: (ref: string) => E) => (ref: string): Either<E, Ref> =>
	isRef(ref) ? right(ref) : left(onFail(ref));
const match = (ref: Ref): RegExpMatchArray => ref.match(refMatcher)!;

export interface ParsedRef {
	readonly $ref: string;
	readonly name: string;
	readonly path: string;
	readonly target: string;
}
export const parseRef = ($ref: Ref): ParsedRef => {
	const m = match($ref);
	const path = m[2];
	const target = m[1];
	const parts = path.split('/');
	const name = parts[parts.length - 1];
	return {
		$ref,
		path,
		name,
		target,
	};
};
