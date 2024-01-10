import { oneOf } from '../utils.bundle';
import { string, Type, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { none, some } from 'fp-ts/lib/Option';

describe('utils.bundle', () => {
	describe('oneOf', () => {
		function expectDecodeResult(o: Type<any>, input: unknown, valid: boolean) {
			expect(o.is(input)).toBe(valid);
			expect(o.validate(input, [])).toMatchObject({ _tag: valid ? 'Right' : 'Left' });
		}

		it('should ensure that the value matches exactly one schema', () => {
			const o = oneOf([type({ left: string }), type({ right: string })]);

			expectDecodeResult(o, { left: 'test' }, true);
			expectDecodeResult(o, { right: 'test' }, true);
			expectDecodeResult(o, { right: 'test', extra: 'allowed' }, true);

			expectDecodeResult(o, {}, false);
			expectDecodeResult(o, { middle: '???' }, false);
			expectDecodeResult(o, { left: 1000 }, false);
			expectDecodeResult(o, { left: 'test', right: 'test' }, false);
		});

		it('should encode correctly, even if multiple schemas are matched', () => {
			const o = oneOf([type({ left: optionFromNullable(string) }), type({ right: optionFromNullable(string) })]);

			expect(o.encode({ left: some('123') })).toEqual({ left: '123' });

			const value = { left: some('test'), extra: 'allowed' };
			expect(o.encode(value)).toEqual({ left: 'test', extra: 'allowed' });

			expect(o.encode({ right: none })).toEqual({ right: null });

			// Note: `encode` does not check `is` before processing, so it will attempt to encode the value even
			// if it matches multiple schemas. Only one schema will be used for encoding, so the result below is
			// correct even though undesirable
			expect(o.encode({ left: some('123'), right: none })).toEqual({ left: '123', right: none });
		});
	});
});
