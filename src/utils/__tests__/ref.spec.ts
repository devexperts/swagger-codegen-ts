import { getRefTargetName } from '../ref';

describe('ref.utils', () => {
	describe('getRefTargetName', () => {
		it('should fail for empty path', () => {
			expect(getRefTargetName('')).toBe(undefined);
		});
		it('should return last part of url as name', () => {
			expect(getRefTargetName('#/components/schemas/user')).toBe('User');
		});
		it('should support references', () => {
			expect(getRefTargetName('petstore.yaml#/components/schemas/Pet')).toBe('Pet');
			expect(getRefTargetName('https://petstore.swagger.io/v2/swagger.json#/components/schemas/Pet')).toBe('Pet');
		});
	});
});
