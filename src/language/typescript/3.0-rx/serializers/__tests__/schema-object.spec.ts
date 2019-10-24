import { serializeNonArraySchemaObject, serializeSchemaObject } from '../schema-object';
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
import { Either, right } from 'fp-ts/lib/Either';
import { assert, constant, property, record, string } from 'fast-check';
import { $refArbitrary } from '../../../../../utils/__tests__/ref.spec';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { SchemaObjectCodec } from '../../../../../schema/3.0/schema-object';
import { none } from 'fp-ts/lib/Option';

const chainEither = <A, EB, B>(f: (a: A) => Either<EB, B>) => <EA>(fa: Either<EA, A>): Either<EA | EB, B> =>
	pipe(
		fa,
		either.chain<EA | EB, A, B>(f),
	);

describe('SchemaObject', () => {
	describe('serializeNonArraySchemaObject', () => {
		describe('should serialize', () => {
			it('string', () => {
				expect(serializeNonArraySchemaObject({ type: 'string', format: none, deprecated: none })).toEqual(
					right(serializedType('string', 'string', [serializedDependency('string', 'io-ts')], [])),
				);
			});
			it('boolean', () => {
				expect(serializeNonArraySchemaObject({ type: 'boolean', format: none, deprecated: none })).toEqual(
					right(serializedType('boolean', 'boolean', [serializedDependency('boolean', 'io-ts')], [])),
				);
			});
			it('integer', () => {
				expect(serializeNonArraySchemaObject({ type: 'integer', format: none, deprecated: none })).toEqual(
					right(serializedType('number', 'number', [serializedDependency('number', 'io-ts')], [])),
				);
			});
			it('number', () => {
				expect(serializeNonArraySchemaObject({ type: 'number', format: none, deprecated: none })).toEqual(
					right(serializedType('number', 'number', [serializedDependency('number', 'io-ts')], [])),
				);
			});
		});
	});
	describe('serializeSchemaObject', () => {
		describe('array', () => {
			it('should serialize using getSerializedArrayType', () => {
				const schema = record({
					type: constant<'array'>('array'),
					items: record({
						type: constant<'string'>('string'),
						format: constant(none),
						deprecated: constant(none),
					}),
					format: constant(none),
					deprecated: constant(none),
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
						const schema = SchemaObjectCodec.decode({
							type: 'array',
							items: {
								$ref: $refArbitrary.$ref,
							},
						});
						const expected = pipe(
							$refArbitrary,
							getSerializedRefType(from),
							getSerializedArrayType(name),
						);
						expect(
							pipe(
								schema,
								chainEither(serializeSchemaObject(from, name)),
							),
						).toEqual(right(expected));
					}),
				);
			});
		});
		describe('recursive', () => {
			describe('local', () => {
				it('object with array of items of self type', () => {
					assert(
						property($refArbitrary, ref => {
							const schema = SchemaObjectCodec.decode({
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
							});
							const expected = pipe(
								ref,
								getSerializedRefType(ref),
								getSerializedArrayType(undefined),
								getSerializedPropertyType('children', true),
								getSerializedObjectType(undefined),
								getSerializedRecursiveType(ref),
							);
							const serialized = pipe(
								schema,
								chainEither(serializeSchemaObject(ref)),
							);

							expect(serialized).toEqual(right(expected));
						}),
					);
				});
				it('object with array of items of object type with one of properties of self type', () => {
					assert(
						property($refArbitrary, ref => {
							const schema = SchemaObjectCodec.decode({
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
							});
							const serialized = pipe(
								schema,
								chainEither(serializeSchemaObject(ref)),
							);
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
							const schema = SchemaObjectCodec.decode({
								type: 'object',
								additionalProperties: {
									$ref: ref.$ref, // references self
								},
							});
							const serialized = pipe(
								schema,
								chainEither(serializeSchemaObject(ref)),
							);

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
