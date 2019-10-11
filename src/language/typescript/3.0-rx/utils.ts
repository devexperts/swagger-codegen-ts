import { chain, isNullable, Nullable } from '../../../utils/nullable';
import { ReferenceObject } from '../../../schema/2.0/reference-object';
import * as url from 'url';
import { pipe } from 'fp-ts/lib/pipeable';
import { camelize } from '@devexperts/utils/dist/string/string';
import { last } from '../../../utils/array';
import { isReferenceObject } from './serializers/reference-object';
import { OpenAPIV3 } from 'openapi-types';
import { Either, left, right } from 'fp-ts/lib/Either';

export interface Dereference {
	//todo find a better way, possibly using io-ts validation on the fly
	<A = unknown>(referenceObject: ReferenceObject): Nullable<A>;
}

export const resolveReference = <E, A>(
	dereference: Dereference,
	reference: OpenAPIV3.ReferenceObject | A,
	onMiss: ($ref: string) => E,
): Either<E, A> => {
	if (isReferenceObject(reference)) {
		const dereferenced = dereference<A>(reference);
		return isNullable(dereferenced) ? left(onMiss(reference.$ref)) : right(dereferenced);
	}
	return right(reference);
};

const before = (symbol: string) => (path: string): string => {
	const index = path.indexOf(symbol);
	if (index >= 0) {
		return path.substr(0, index);
	}
	return path;
};

export const getRefTargetName = (path: string): Nullable<string> =>
	pipe(
		path.replace(/^#/, ''),
		before('#'),
		before('?'),
		chain(p => url.parse(p).pathname),
		chain(p => last(p.split('/'))),
		chain(name => camelize(name, false)),
	);
