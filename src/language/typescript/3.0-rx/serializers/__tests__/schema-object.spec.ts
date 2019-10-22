import { isNonEmptyArraySchemaObject, serializeNonArraySchemaObject, serializeSchemaObject } from '../schema-object';
import { OpenAPIV3 } from 'openapi-types';
import {
	getSerializedArrayType,
	getSerializedDictionaryType,
	getSerializedObjectType,
	getSerializedPropertyType,
	getSerializedRecursiveType,
	getSerializedRefType,
	serializedType,
} from '../../../common/data/serialized-type';
import { serializedDependency } from '../../../common/data/serialized-dependency';
import { isLeft, right } from 'fp-ts/lib/Either';
import { assert, constant, constantFrom, property, record, string } from 'fast-check';
import { $refArbitrary } from '../../../../../utils/__tests__/ref.spec';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';

const primitiveTypes: OpenAPIV3.NonArraySchemaObject['type'][] = ['null', 'boolean', 'number', 'string', 'integer'];

describe('SchemaObject', () => {
	describe('isNonEmptyArraySchemaObject', () => {
		it('should detect', () => {
			assert(
				property(constantFrom(...primitiveTypes), type =>
					expect(isNonEmptyArraySchemaObject({ type })).toBeTruthy(),
				),
			);
			expect(isNonEmptyArraySchemaObject({ type: 'object' })).toBeTruthy();
			expect(isNonEmptyArraySchemaObject({ type: 'array', items: { $ref: '' } })).toBeFalsy();
		});
	});
	describe('serializeNonArraySchemaObject', () => {
		it('should fail for objects', () => {
			expect(isLeft(serializeNonArraySchemaObject({ type: 'object' }))).toBeTruthy();
		});
		describe('should serialize', () => {
			it('null', () => {
				expect(serializeNonArraySchemaObject({ type: 'null' })).toEqual(
					right(serializedType('null', 'literal(null)', [serializedDependency('literal', 'io-ts')], [])),
				);
			});
			it('string', () => {
				expect(serializeNonArraySchemaObject({ type: 'string' })).toEqual(
					right(serializedType('string', 'string', [serializedDependency('string', 'io-ts')], [])),
				);
			});
			it('boolean', () => {
				expect(serializeNonArraySchemaObject({ type: 'boolean' })).toEqual(
					right(serializedType('boolean', 'boolean', [serializedDependency('boolean', 'io-ts')], [])),
				);
			});
			it('integer', () => {
				expect(serializeNonArraySchemaObject({ type: 'integer' })).toEqual(
					right(serializedType('number', 'number', [serializedDependency('number', 'io-ts')], [])),
				);
			});
			it('number', () => {
				expect(serializeNonArraySchemaObject({ type: 'number' })).toEqual(
					right(serializedType('number', 'number', [serializedDependency('number', 'io-ts')], [])),
				);
			});
		});
	});
	describe('serializeSchemaObject', () => {
		it('should use serializeNonArraySchemaObject for primitives', () => {
			const schema = constantFrom(...primitiveTypes).map(type => ({ type }));
			assert(
				property($refArbitrary, schema, string(), (from, schema, name) => {
					expect(serializeSchemaObject(from, name)(schema)).toEqual(serializeNonArraySchemaObject(schema));
				}),
			);
		});
		describe('array', () => {
			it('should serialize using getSerializedArrayType', () => {
				const schema = record({
					type: constant<'array'>('array'),
					items: record({
						type: constant<'string'>('string'),
					}),
				});
				assert(
					property($refArbitrary, schema, string(), (from, schema, name) => {
						const expected = pipe(
							schema.items,
							serializeSchemaObject(from, name),
							either.map(getSerializedArrayType(name)),
						);
						const serialized = pipe(
							schema,
							serializeSchemaObject(from, name),
						);
						expect(serialized).toEqual(expected);
					}),
				);
			});
			it('should support items.$ref', () => {
				assert(
					property($refArbitrary, $refArbitrary, string(), (from, $refArbitrary, name) => {
						const schema: OpenAPIV3.SchemaObject = {
							type: 'array',
							items: {
								$ref: $refArbitrary.$ref,
							},
						};
						const expected = pipe(
							$refArbitrary,
							getSerializedRefType(from),
							getSerializedArrayType(name),
						);
						expect(serializeSchemaObject(from, name)(schema)).toEqual(right(expected));
					}),
				);
			});
		});
		describe('recursive', () => {
			describe('local', () => {
				it('object with array of items of self type', () => {
					assert(
						property($refArbitrary, ref => {
							const schema: OpenAPIV3.SchemaObject = {
								type: 'object',
								required: ['children'],
								properties: {
									children: {
										type: 'array',
										items: {
											$ref: ref.$ref, // references self
										},
									},
								},
							};
							const expected = pipe(
								ref,
								getSerializedRefType(ref),
								getSerializedArrayType(undefined),
								getSerializedPropertyType('children', true),
								getSerializedObjectType(undefined),
								getSerializedRecursiveType(ref),
							);
							const serialized = serializeSchemaObject(ref)(schema);

							expect(serialized).toEqual(right(expected));
						}),
					);
				});
				it('object with array of items of object type with one of properties of self type', () => {
					assert(
						property($refArbitrary, ref => {
							const schema: OpenAPIV3.SchemaObject = {
								type: 'object',
								required: ['children'],
								properties: {
									children: {
										type: 'object',
										properties: {
											self: {
												$ref: ref.$ref, // references self
											},
										},
										required: ['self'],
									},
								},
							};
							const serialized = serializeSchemaObject(ref)(schema);
							const expected = pipe(
								ref,
								getSerializedRefType(ref),
								getSerializedPropertyType('self', true),
								getSerializedObjectType(undefined),
								getSerializedPropertyType('children', true),
								getSerializedObjectType(undefined),
								getSerializedRecursiveType(ref),
							);
							expect(serialized).toEqual(right(expected));
						}),
					);
				});
				it('object with additionalProperties of self type', () => {
					assert(
						property($refArbitrary, ref => {
							const schema: OpenAPIV3.SchemaObject = {
								type: 'object',
								additionalProperties: {
									$ref: ref.$ref, // references self
								},
							};
							const serialized = serializeSchemaObject(ref)(schema);

							const expected = pipe(
								ref,
								getSerializedRefType(ref),
								getSerializedDictionaryType(undefined),
								getSerializedRecursiveType(ref),
							);

							expect(serialized).toEqual(right(expected));
						}),
					);
				});
			});
		});
	});
});
