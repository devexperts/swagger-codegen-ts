import { pipe } from 'fp-ts/lib/pipeable';
import * as nullable from './nullable';
import { last, lookup } from './array';
import { Nullable, sequenceTNullable } from './nullable';
import { split } from './string';

const refMatcher = /^([^#]*)#\/([^#]*)$/;
export const getRefTargetName = (ref: string): Nullable<string> => {
	const match = ref.trim().match(refMatcher);
	return pipe(
		match,
		nullable.chain(m => m[2]),
		nullable.chain(p => last(p.split('/'))),
	);
};

export interface ParsedRef {
	readonly name: string;
	readonly path: string;
	readonly target: string;
}
export const parseRef = (ref: string): Nullable<ParsedRef> => {
	const match = ref.trim().match(refMatcher);
	const path = pipe(
		match,
		nullable.chain(lookup(2)),
	);
	const target = pipe(
		match,
		nullable.chain(lookup(1)),
	);
	const name = pipe(
		path,
		nullable.chain(split('/')),
		nullable.chain(last),
	);
	return pipe(
		sequenceTNullable(path, name, target),
		nullable.map(([path, name, target]) => ({ path, name, target })),
	);
};
