import { getRefTargetName } from '../utils';

describe('3.0-RX utils', () => {
	describe('getRefTargetName', () => {
		it('should return undefined for empty path', () => {
			expect(getRefTargetName('')).toBe(undefined);
		});
		it('should return last part of url as name', () => {
			expect(getRefTargetName('#/components/schemas/user')).toBe('User');
		});
		it('should ignore "#" and "?"', () => {
			expect(getRefTargetName('#/components/schemas/user?dfssjdkfkdsjfhks')).toBe('User');
			expect(getRefTargetName('#/components/schemas/user#dfssjdkfkdsjfhks')).toBe('User');
		});
	});
});
