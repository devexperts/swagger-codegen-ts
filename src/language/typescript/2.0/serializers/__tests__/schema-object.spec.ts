import { assert, property } from 'fast-check';
import { $refArbitrary } from '../../../../../utils/__tests__/ref.spec';
import {
	getSerializedObjectType,
	getSerializedPropertyType,
	getSerializedRecursiveType,
	getSerializedRefType,
} from '../../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSchemaObject } from '../schema-object';
import { SchemaObjectCodec } from '../../../../../schema/2.0/schema-object/schema-object';
import { right } from 'fp-ts/lib/Either';
import { either } from 'fp-ts';
import { reportIfFailed } from '../../../../../utils/io-ts';

describe('SchemaObject serializer', () => {
	describe('recursive', () => {
		it('level 1', () => {
			assert(
				property($refArbitrary, ref => {
					const schema = SchemaObjectCodec.decode({
						type: 'object',
						required: ['recursive'],
						properties: {
							recursive: {
								$ref: ref.$ref,
							},
						},
					});
					const expected = pipe(
						ref,
						getSerializedRefType(ref),
						getSerializedPropertyType('recursive', true),
						getSerializedObjectType(),
						getSerializedRecursiveType(ref, true),
					);
					const serialized = pipe(
						schema,
						reportIfFailed,
						either.chain(schema => serializeSchemaObject(ref, schema)),
					);
					expect(serialized).toEqual(right(expected));
				}),
			);
		});
		it('level 2', () => {
			assert(
				property($refArbitrary, ref => {
					const schema = SchemaObjectCodec.decode({
						type: 'object',
						required: ['children'],
						properties: {
							children: {
								type: 'object',
								required: ['recursive'],
								properties: {
									recursive: {
										$ref: ref.$ref,
									},
								},
							},
						},
					});
					const expected = pipe(
						ref,
						getSerializedRefType(ref),
						getSerializedPropertyType('recursive', true),
						getSerializedObjectType(),
						getSerializedPropertyType('children', true),
						getSerializedObjectType(),
						getSerializedRecursiveType(ref, true),
					);
					const serialized = pipe(
						schema,
						reportIfFailed,
						either.chain(schema => serializeSchemaObject(ref, schema)),
					);
					expect(serialized).toEqual(right(expected));
				}),
			);
		});
	});
});
