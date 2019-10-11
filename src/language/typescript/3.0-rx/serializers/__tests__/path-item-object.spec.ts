// import { serializePathItemObjectTags } from '../path-item-object';
//
// describe('PathItemObject serializer', () => {
// 	describe('serializePathItemObjectTags', () => {
// 		it('should return undefined when PathItemObject contains no operations', () => {
// 			expect(serializePathItemObjectTags({})).toBe(undefined);
// 		});
// 		it('should return undefined when all PathItemObject OperationObjects contain no tags', () => {
// 			expect(
// 				serializePathItemObjectTags({
// 					get: {
// 						tags: [],
// 					},
// 					post: {
// 						tags: [],
// 					},
// 				}),
// 			).toBe(undefined);
// 		});
// 		it('should join tags', () => {
// 			expect(
// 				serializePathItemObjectTags({
// 					get: {
// 						tags: ['a', 'b'],
// 					},
// 					post: {
// 						tags: ['c', 'd'],
// 					},
// 				}),
// 			).toBe('abcd');
// 		});
// 		it('should skip repeating tags', () => {
// 			expect(
// 				serializePathItemObjectTags({
// 					get: {
// 						tags: ['a', 'a'],
// 					},
// 					post: {
// 						tags: ['a', 'a'],
// 					},
// 				}),
// 			).toBe('a');
// 		});
// 		it('should skip spaces', () => {
// 			expect(
// 				serializePathItemObjectTags({
// 					get: {
// 						tags: [' a a ', ' b b '],
// 					},
// 					post: {
// 						tags: [' c c ', ' d d '],
// 					},
// 				}),
// 			).toBe('aabbccdd');
// 		});
// 	});
// });

describe('foo', () => {
	it('', () => {});
});
