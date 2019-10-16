import { isNonEmptyArraySchemaObject, serializeNonArraySchemaObject, serializeSchemaObject } from '../schema-object';
import { OpenAPIV3 } from 'openapi-types';
import { getSerializedArrayType, serializedType } from '../../../common/data/serialized-type';
import { serializedDependency } from '../../../common/data/serialized-dependency';
import { isLeft, right } from 'fp-ts/lib/Either';
import { Context } from '../../utils';
import { constUndefined } from 'fp-ts/lib/function';
import { assert, constant, constantFrom, property, record, string, tuple } from 'fast-check';
import { $refArbitrary } from '../../../../../utils/__tests__/ref.spec';
import { parseRef } from '../../../../../utils/ref';
import { getIOName, getTypeName } from '../../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';

const primitiveTypes: OpenAPIV3.NonArraySchemaObject['type'][] = ['null', 'boolean', 'number', 'string', 'integer'];
const context: Context = {
	serializeRef: () => ref => {
		const parsed = parseRef(ref);
		const type = getTypeName(parsed.name);
		const io = getIOName(parsed.name);
		const p = 'IMPORT_PATH';
		return serializedType(type, io, [serializedDependency(type, p), serializedDependency(io, p)], [type]);
	},
	resolveRef: constUndefined,
};

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
		const rootName = string();
		const cwd = string();
		it('should use serializeNonArraySchemaObject for primitives', () => {
			const schema = constantFrom(...primitiveTypes).map(type => ({ type }));
			assert(
				property(rootName, cwd, schema, (rootName, cwd, schema) => {
					expect(serializeSchemaObject(context)(rootName, cwd)(schema)).toEqual(
						serializeNonArraySchemaObject(schema),
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
					}),
				});
				assert(
					property(rootName, cwd, schema, (rootName, cwd, schema) => {
						const expected = pipe(
							schema.items,
							serializeSchemaObject(context)(rootName, cwd),
							either.map(getSerializedArrayType),
						);
						const serialized = pipe(
							schema,
							serializeSchemaObject(context)(rootName, cwd),
						);
						expect(serialized).toEqual(expected);
					}),
				);
			});
			it('should support items.$ref', () => {
				const schema = record({
					type: constant<'array'>('array'),
					items: record({
						$ref: $refArbitrary,
					}),
				});
				assert(
					property(rootName, cwd, schema, (rootName, cwd, schema) => {
						const expected = pipe(
							schema.items.$ref,
							context.serializeRef(cwd),
							getSerializedArrayType,
						);
						expect(serializeSchemaObject(context)(rootName, cwd)(schema)).toEqual(right(expected));
					}),
				);
			});
		});
	});
});
