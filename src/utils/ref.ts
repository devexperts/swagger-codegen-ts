import { pipe } from 'fp-ts/lib/pipeable';
import * as nullable from './nullable';
import { init, join, last, lookup } from './array';
import { camelize } from '@devexperts/utils/dist/string';
import { Nullable, sequenceTNullable } from './nullable';
import { split } from './string';

const refMatcher = /^([^#]*)#\/([^#]*)$/;
export const getRefTargetName = (ref: string): Nullable<string> => {
	const match = ref.trim().match(refMatcher);
	return pipe(
		match,
		nullable.chain(m => m[2]),
		nullable.chain(p => last(p.split('/'))),
		nullable.map(name => camelize(name, false)),
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
		nullable.map(name => camelize(name, false)),
	);
	return pipe(
		sequenceTNullable(path, name, target),
		nullable.map(([path, name, target]) => ({ path, name, target })),
	);
};
