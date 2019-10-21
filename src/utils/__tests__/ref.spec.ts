import { Ref, fromString, getRelativePath, getFullPath } from '../ref';
import { Arbitrary, assert, property, string, tuple } from 'fast-check';
import { trim } from '../string';
import { arbitrary, nonEmptyArray } from '../fast-check';
import { last } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/pipeable';
import { isRight, right } from 'fp-ts/lib/Either';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { either } from 'fp-ts';

export const $refArbitrary: Arbitrary<Ref> = pipe(
	tuple(string(), nonEmptyArray(string(1, 10).filter(s => !s.includes('/')))),
	arbitrary.map(([target, paths]) => `${target}#/${paths.join('/')}`),
	arbitrary.map(fromString),
	arbitrary.filter(isRight),
	arbitrary.map(e => e.right),
);

describe('ref.utils', () => {
	const target = string()
		.map(trim)
		.filter(t => !t.includes('#'));
	const parts = nonEmptyArray(
		string(1, 10)
			.map(trim)
			.filter(t => t !== '' && !t.includes('#') && !t.includes('/'))
			.map(p => `/${p}`),
	);
	it('parseRef', () => {
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
	describe('getRelativePath', () => {
		it('without target', () => {
			const from = fromString('#/components/schemas/Source');
			const to = fromString('#/components/schemas/Target');
			expect(combineEither(from, to, getRelativePath)).toEqual(right('../../components/schemas/Target'));
		});
		it('with target', () => {
			const from = fromString('#/components/schemas/Source');
			const to = fromString('target#/components/schemas/Target');
			expect(combineEither(from, to, getRelativePath)).toEqual(
				right('../../../target/components/schemas/Target'),
			);
		});
		it('test', () => {
			const from = fromString('#/paths/PetController');
			const to = fromString('#/components/schemas/Pet');
			expect(combineEither(from, to, getRelativePath)).toEqual(right('../components/schemas/Pet'));
		});
	});
});
