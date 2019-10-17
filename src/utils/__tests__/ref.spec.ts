import { isRef, parseRef, Ref } from '../ref';
import { Arbitrary, assert, property, string } from 'fast-check';
import { trim } from '../string';
import { arbitrary, nonEmptyArray } from '../fast-check';
import { last } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/pipeable';

export const $refArbitrary: Arbitrary<Ref> = pipe(
	string(),
	arbitrary.filter(isRef),
);

describe('ref.utils', () => {
	it('parseRef', () => {
		const target = string()
			.map(trim)
			.filter(t => !t.includes('#'));
		const parts = nonEmptyArray(
			string(1, 10)
				.map(trim)
				.filter(t => t !== '' && !t.includes('#') && !t.includes('/')),
		);
		assert(property(target, parts, (target, parts) => isRef(`${target}#/${parts.join('/')}`)));
		assert(
			property(target, parts, (target, parts) => {
				const path = `${parts.join('/')}`;
				const $ref = `${target}#/${path}`;
				if (isRef($ref)) {
					expect(parseRef($ref)).toEqual({
						$ref,
						target,
						name: last(parts),
						path,
					});
				}
			}),
		);
	});
});
