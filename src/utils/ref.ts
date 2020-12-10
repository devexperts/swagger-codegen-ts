import * as path from 'path';
import { isNonEmpty, uniq } from 'fp-ts/lib/Array';
import { last, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Either, left, right } from 'fp-ts/lib/Either';
import { Eq, eqString, getStructEq } from 'fp-ts/lib/Eq';
import { Decoder } from 'io-ts';

export interface Ref<R extends string = string> {
	readonly $ref: string;
	readonly name: string;
	readonly path: string;
	readonly target: string;
}

export const eqRef: Eq<Ref> = getStructEq({
	$ref: eqString,
	name: eqString,
	path: eqString,
	target: eqString,
});
export const uniqRefs = uniq(eqRef);

export const fromString = <R extends string>($ref: R): Either<Error, Ref<R>> => {
	let target = '';
	let inPath = false;
	let pathPart = '';
	const parts: string[] = [];
	const invalid = left(new Error(`Invalid ref "${$ref}"`));
	if ($ref.length === 0) {
		return invalid;
	}
	for (const symbol of $ref) {
		switch (symbol) {
			case '#': {
				if (inPath) {
					return invalid;
				}
				inPath = true;
				break;
			}
			case '/': {
				if (!inPath) {
					target += '/';
				} else if (pathPart === '') {
					pathPart = '/';
				} else if (pathPart === '/') {
					pathPart = '/';
				} else {
					parts.push(pathPart);
					pathPart = '/';
				}
				break;
			}
			default: {
				if (!inPath) {
					target += symbol;
				} else if (pathPart === '') {
					return invalid;
				} else {
					pathPart += symbol;
				}
				break;
			}
		}
	}

	if (pathPart !== '' && pathPart !== '/') {
		parts.push(pathPart);
	}

	if (!isNonEmpty(parts)) {
		return invalid;
	}
	const name = last(parts).slice(1); //skip leading '/'
	const path = parts.join('');
	return right({
		$ref,
		name,
		path,
		target,
	});
};

export const addPathParts = (...parts: NonEmptyArray<string>) => (ref: Ref): Either<Error, Ref> =>
	fromString(`${ref.$ref}/${parts.join('/')}`);

export const getRelativePath = (from: Ref, to: Ref): string => {
	const toSelf = path.relative(path.dirname(from.path), '/');
	const toRoot = to.target === '' ? toSelf : path.join('..', toSelf);
	const joined = path.join(toRoot, to.target, to.path);
	const joinedWithProperSeparator =
		path.sep === path.posix.sep ? joined : joined.split(path.sep).join(path.posix.sep);
	return joinedWithProperSeparator.startsWith('..') ? joinedWithProperSeparator : `./${joinedWithProperSeparator}`;
};

export const getFullPath = (ref: Ref): string => path.join(ref.target, ref.path);

export interface ResolveRef {
	<A>($ref: string, decoder: Decoder<unknown, A>): Either<Error, A>;
}

export interface ResolveRefContext {
	readonly resolveRef: ResolveRef;
}
