import * as typescript from 'typescript';
import { client } from '../client';

describe('client', () => {
	describe('ResponseValidationError class', () => {
		it('should produce uniquely identifiable instance of itself', () => {
			const exports = {} as any;

			const clientCodeTranspiled = typescript.transpile(client, {
				target: typescript.ScriptTarget.ESNext,
				module: typescript.ModuleKind.None,
			});

			// eslint-disable-next-line no-eval
			eval(clientCodeTranspiled);

			expect(exports.ResponseValidationError.create([])).toBeInstanceOf(exports.ResponseValidationError);
			expect(exports.ResponseValidationError.create([])).toBeInstanceOf(Error);
		});
		it('should produce instance that not crashing when its casted to string', () => {
			const exports = {} as any;
			const clientCodeTranspiled = typescript.transpile(client, {
				target: typescript.ScriptTarget.ESNext,
				module: typescript.ModuleKind.None,
			});

			// eslint-disable-next-line no-eval
			eval(clientCodeTranspiled);

			expect(() => String(exports.ResponseValidationError.create([]))).not.toThrow();
		});
	});
});
