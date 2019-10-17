import * as path from 'path';
import { isNonEmpty } from 'fp-ts/lib/Array';
import { last } from 'fp-ts/lib/NonEmptyArray';
import { Either, left, right } from 'fp-ts/lib/Either';

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
