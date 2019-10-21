import * as path from 'path';
import { isNonEmpty } from 'fp-ts/lib/Array';
import { last, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Either, left, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, nonEmptyArray } from 'fp-ts';

export interface Ref {
	readonly $ref: string;
	readonly name: string;
	readonly path: string;
	readonly target: string;
}

export const fromString = ($ref: string): Either<Error, Ref> => {
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

export const buildRelativePath = (cwd: string, ref: Ref): string => {
	const toRoot = path.relative(cwd, ref.target === '' ? '.' : '..');
	const joined = path.join(toRoot, ref.target, ref.path);
	return joined.startsWith('..') ? joined : `./${joined}`;
};

export interface Refs extends NonEmptyArray<Ref> {}

export const fromStrings = (...paths: NonEmptyArray<string>): Either<Error, Refs> =>
	pipe(
		paths,
		nonEmptyArray.map(fromString),
		nonEmptyArray.nonEmptyArray.sequence(either.either),
	);

export const addPathParts = (...parts: NonEmptyArray<string>) => (ref: Ref): Either<Error, Ref> =>
	fromString(`${ref.$ref}/${parts.join('/')}`);

export const getRelativePath = (from: Ref, to: Ref): string => {
	const toSelf = path.relative(path.dirname(from.path), '/');
	const toRoot = to.target === '' ? toSelf : path.join('..', toSelf);
	const joined = path.join(toRoot, to.target, to.path);
	return joined.startsWith('..') ? joined : `./${joined}`;
};

export const getFullPath = (ref: Ref): string => path.join(ref.target, ref.path);
