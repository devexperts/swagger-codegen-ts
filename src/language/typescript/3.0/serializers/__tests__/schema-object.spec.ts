import { serializeSchemaObject } from '../schema-object';
import {
	getSerializedArrayType,
	getSerializedDictionaryType,
	getSerializedObjectType,
	getSerializedOptionPropertyType,
	getSerializedRecursiveType,
	getSerializedRefType,
} from '../../../common/data/serialized-type';
import { right } from 'fp-ts/lib/Either';
import { assert, constant, property, record, string } from 'fast-check';
import { $refArbitrary } from '../../../../../utils/__tests__/ref.spec';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { SchemaObjectCodec } from '../../../../../schema/3.0/schema-object';
import { none } from 'fp-ts/lib/Option';
import { reportIfFailed } from '../../../../../utils/io-ts';

describe('SchemaObject', () => {
	describe('serializeSchemaObject', () => {
		describe('array', () => {
			it('should serialize using getSerializedArrayType', () => {
				const schema = record({
					type: constant<'array'>('array'),
					items: record({
						type: constant<'string'>('string'),
						format: constant(none),
						deprecated: constant(none),
						nullable: constant(none),
					}),
					format: constant(none),
					deprecated: constant(none),
					nullable: constant(none),
				});
				assert(
					property($refArbitrary, schema, string(), (from, schema, name) => {
						const expected = pipe(
							schema.items,
							serializeSchemaObject(from, name),
							either.map(getSerializedArrayType(name)),
						);
						const serialized = pipe(schema, serializeSchemaObject(from, name));
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
						const expected = pipe($refArbitrary, getSerializedRefType(from), getSerializedArrayType(name));
						expect(pipe(schema, reportIfFailed, either.chain(serializeSchemaObject(from, name)))).toEqual(
							right(expected),
						);
					}),
				);
			});
		});
		describe('recursive', () => {
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
							getSerializedOptionPropertyType('children', true),
							getSerializedObjectType(undefined),
							getSerializedRecursiveType(ref, true),
						);
						const serialized = pipe(schema, reportIfFailed, either.chain(serializeSchemaObject(ref)));

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
						const serialized = pipe(schema, reportIfFailed, either.chain(serializeSchemaObject(ref)));
						const expected = pipe(
							ref,
							getSerializedRefType(ref),
							getSerializedOptionPropertyType('self', true),
							getSerializedObjectType(undefined),
							getSerializedOptionPropertyType('children', true),
							getSerializedObjectType(undefined),
							getSerializedRecursiveType(ref, true),
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
						const serialized = pipe(schema, reportIfFailed, either.chain(serializeSchemaObject(ref)));

						const expected = pipe(
							ref,
							getSerializedRefType(ref),
							getSerializedDictionaryType(undefined),
							getSerializedRecursiveType(ref, true),
						);

						expect(serialized).toEqual(right(expected));
					}),
				);
			});
		});
	});
});
