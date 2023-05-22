import { serializeSchemaObjectDefault } from '../schema-object';
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
		it('should properly handle nested allOf / oneOf', () => {
			assert(
				property($refArbitrary, ref => {
					const schema = SchemaObjectCodec.decode({
						allOf: [
							{
								type: 'object',
								properties: {
									id: { type: 'string' },
								},
								required: ['id'],
							},
							{
								oneOf: [
									{
										type: 'object',
										properties: {
											value: { type: 'string' },
										},
										required: ['value'],
									},
									{
										type: 'object',
										properties: {
											error: { type: 'string' },
										},
										required: ['error'],
									},
								],
							},
						],
					});
					const serialized = pipe(schema, reportIfFailed, either.chain(serializeSchemaObjectDefault(ref)));
					pipe(
						serialized,
						either.fold(fail, result => {
							expect(result.type).toEqual('{ id: string } & ({ value: string } | { error: string })');
							expect(result.io).toEqual(
								'intersection([type({ id: string }),union([type({ value: string }),type({ error: string })])])',
							);
						}),
					);
				}),
			);
		});
		describe('array', () => {
			it('should serialize using getSerializedArrayType', () => {
				const schema = record({
					type: constant<'array'>('array'),
					items: record({
						type: constant<'string'>('string'),
						format: constant(none),
						deprecated: constant(none),
						nullable: constant(none),
						minItems: constant(none),
						maxItems: constant(none),
					}),
					format: constant(none),
					deprecated: constant(none),
					nullable: constant(none),
					minItems: constant(none),
					maxItems: constant(none),
				});
				assert(
					property($refArbitrary, schema, string(), (from, schema, name) => {
						const expected = pipe(
							schema.items,
							serializeSchemaObjectDefault(from, name),
							either.map(getSerializedArrayType(none, name)),
						);
						const serialized = pipe(schema, serializeSchemaObjectDefault(from, name));
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
							getSerializedArrayType(none, name),
						);
						expect(
							pipe(schema, reportIfFailed, either.chain(serializeSchemaObjectDefault(from, name))),
						).toEqual(right(expected));
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
							getSerializedArrayType(none, undefined),
							getSerializedOptionPropertyType('children', true),
							getSerializedObjectType(undefined),
							getSerializedRecursiveType(ref, true),
						);
						const serialized = pipe(
							schema,
							reportIfFailed,
							either.chain(serializeSchemaObjectDefault(ref)),
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
							reportIfFailed,
							either.chain(serializeSchemaObjectDefault(ref)),
						);
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
						const serialized = pipe(
							schema,
							reportIfFailed,
							either.chain(serializeSchemaObjectDefault(ref)),
						);

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
