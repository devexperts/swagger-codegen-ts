import { Ref, fromString } from '../ref';
import { Arbitrary, assert, property, string, tuple } from 'fast-check';
import { trim } from '../string';
import { arbitrary, nonEmptyArray } from '../fast-check';
import { last } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/pipeable';
import { isRight, right } from 'fp-ts/lib/Either';

export const $refArbitrary: Arbitrary<Ref> = pipe(
	tuple(string(), nonEmptyArray(string(1, 10).filter(s => !s.includes('/')))),
	arbitrary.map(([target, paths]) => `${target}#/${paths.join('/')}`),
	arbitrary.map(fromString),
	arbitrary.filter(isRight),
	arbitrary.map(e => e.right),
);

describe('ref.utils', () => {
	it('parseRef', () => {
		const target = string()
			.map(trim)
			.filter(t => !t.includes('#'));
		const parts = nonEmptyArray(
			string(1, 10)
				.map(trim)
				.filter(t => t !== '' && !t.includes('#') && !t.includes('/'))
				.map(p => `/${p}`),
		);
		assert(property(target, parts, (target, parts) => isRight(fromString(`${target}#${parts.join('')}`))));
		assert(
			property(target, parts, (target, parts) => {
				const path = `${parts.join('')}`;
				const $ref = `${target}#${path}`;
				const name = last(parts).slice(1); // skip leading '/'

				expect(fromString($ref)).toEqual(
					right({
						$ref,
						target,
						name,
						path,
					}),
				);
			}),
		);
	});
});
