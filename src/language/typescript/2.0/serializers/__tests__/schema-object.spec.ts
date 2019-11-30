import { assert, property } from 'fast-check';
import { $refArbitrary } from '../../../../../utils/__tests__/ref.spec';
import {
	getSerializedIntersectionType,
	getSerializedObjectType,
	getSerializedOptionPropertyType,
	getSerializedRecursiveType,
	getSerializedRefType,
	SERIALIZED_STRING_TYPE,
} from '../../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSchemaObject } from '../schema-object';
import { SchemaObjectCodec } from '../../../../../schema/2.0/schema-object';
import { right } from 'fp-ts/lib/Either';
import { either } from 'fp-ts';
import { reportIfFailed } from '../../../../../utils/io-ts';
import { makeNormalizedName } from '../../../common/normalized-name';

describe('SchemaObject serializer', () => {
	describe('recursive', () => {
		describe('properties', () => {
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
							getSerializedOptionPropertyType('recursive', true),
							getSerializedObjectType(makeNormalizedName(ref.name)),
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
							getSerializedOptionPropertyType('recursive', true),
							getSerializedObjectType(makeNormalizedName(ref.name)),
							getSerializedOptionPropertyType('children', true),
							getSerializedObjectType(makeNormalizedName(ref.name)),
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
		describe('allOf', () => {
			it('level 1', () => {
				assert(
					property($refArbitrary, ref => {
						const schema = SchemaObjectCodec.decode({
							allOf: [
								{
									type: 'string',
								},
								{
									type: 'object',
									required: ['self'],
									properties: {
										self: {
											$ref: ref.$ref,
										},
									},
								},
							],
						});
						const serialized = pipe(
							schema,
							reportIfFailed,
							either.chain(schema => serializeSchemaObject(ref, schema)),
						);
						const expected = pipe(
							ref,
							getSerializedRefType(ref),
							getSerializedOptionPropertyType('self', true),
							getSerializedObjectType(makeNormalizedName(ref.name)),
							serialized => getSerializedIntersectionType([SERIALIZED_STRING_TYPE, serialized]),
							getSerializedRecursiveType(ref, true),
						);
						expect(serialized).toEqual(right(expected));
					}),
				);
			});
			it('level 2', () => {
				assert(
					property($refArbitrary, ref => {
						const schema = SchemaObjectCodec.decode({
							allOf: [
								{
									type: 'string',
								},
								{
									type: 'object',
									required: ['nested'],
									properties: {
										nested: {
											type: 'object',
											required: ['self'],
											properties: {
												self: {
													$ref: ref.$ref,
												},
											},
										},
									},
								},
							],
						});
						const serialized = pipe(
							schema,
							reportIfFailed,
							either.chain(schema => serializeSchemaObject(ref, schema)),
						);
						const expected = pipe(
							ref,
							getSerializedRefType(ref),
							getSerializedOptionPropertyType('self', true),
							getSerializedObjectType(makeNormalizedName(ref.name)),
							getSerializedOptionPropertyType('nested', true),
							getSerializedObjectType(makeNormalizedName(ref.name)),
							serialized => getSerializedIntersectionType([SERIALIZED_STRING_TYPE, serialized]),
							getSerializedRecursiveType(ref, true),
						);
						expect(serialized).toEqual(right(expected));
					}),
				);
			});
		});
	});
});
