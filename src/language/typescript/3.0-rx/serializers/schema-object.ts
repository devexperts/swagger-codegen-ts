import { OpenAPIV3 } from 'openapi-types';
import {
	SERIALIZED_UNKNOWN_TYPE,
	SerializedType,
	serializedType,
	getSerializedArrayType,
	getSerializedRefType,
	getSerializedDictionaryType,
	getSerializedRecursiveType,
	getSerializedPropertyType,
	getSerializedObjectType,
	intercalateSerializedTypes,
} from '../../common/data/serialized-type';
import { serializedDependency } from '../../common/data/serialized-dependency';
import { Either, left, mapLeft, right } from 'fp-ts/lib/Either';
import { isReferenceObject } from './reference-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import * as nullable from '../../../../utils/nullable';
import { serializeDictionary } from '../../../../utils/types';
import { constFalse } from 'fp-ts/lib/function';
import { includes } from '../../../../utils/array';
import { sequenceEither } from '../../../../utils/either';
import { fromString, Ref } from '../../../../utils/ref';
import { string } from 'io-ts';

type AdditionalProperties = boolean | OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
type AllowedAdditionalProperties = true | OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
const isAllowedAdditionalProperties = (
	additionalProperties: AdditionalProperties,
): additionalProperties is AllowedAdditionalProperties => additionalProperties !== false;

export const serializeNonArraySchemaObject = (
	schemaObject: OpenAPIV3.NonArraySchemaObject,
): Either<Error, SerializedType> => {
	switch (schemaObject.type) {
		case 'null': {
			return right(serializedType('null', 'literal(null)', [serializedDependency('literal', 'io-ts')], []));
		}
		case 'string': {
			return right(serializedType('string', 'string', [serializedDependency('string', 'io-ts')], []));
		}
		case 'boolean': {
			return right(serializedType('boolean', 'boolean', [serializedDependency('boolean', 'io-ts')], []));
		}
		case 'integer':
		case 'number': {
			return right(serializedType('number', 'number', [serializedDependency('number', 'io-ts')], []));
		}
		case 'object': {
			return left(new Error('Objects are not supported as NonArraySchemaObject type'));
		}
	}
};

export const isNonEmptyArraySchemaObject = (
	schemaObject: OpenAPIV3.SchemaObject,
): schemaObject is OpenAPIV3.NonArraySchemaObject =>
	['null', 'boolean', 'object', 'number', 'string', 'integer'].includes(schemaObject.type);

export const serializeSchemaObject = (
	from: Ref,
	name?: string,
): ((schemaObject: OpenAPIV3.SchemaObject) => Either<Error, SerializedType>) =>
	serializeSchemaObjectWithRecursion(from, true, name);

const serializeSchemaObjectWithRecursion = (from: Ref, shouldTrackRecursion: boolean, name?: string) => (
	schemaObject: OpenAPIV3.SchemaObject,
): Either<Error, SerializedType> => {
	switch (schemaObject.type) {
		case 'null':
		case 'boolean':
		case 'number':
		case 'string':
		case 'integer': {
			return serializeNonArraySchemaObject(schemaObject);
		}
		case 'array': {
			const { items } = schemaObject;
			const serialized = isReferenceObject(items)
				? pipe(
						fromString(items.$ref),
						mapLeft(() => new Error(`Unable to serialize SchemaObjeft array items ref "${items.$ref}"`)),
						either.map(getSerializedRefType(from)),
				  )
				: pipe(
						items,
						serializeSchemaObjectWithRecursion(from, false, undefined),
				  );
			return pipe(
				serialized,
				either.map(getSerializedArrayType(name)),
			);
		}
		case 'object': {
			const additionalProperties = pipe(
				schemaObject.additionalProperties,
				nullable.filter(isAllowedAdditionalProperties),
				nullable.map(additionalProperties => {
					if (isReferenceObject(additionalProperties)) {
						return pipe(
							additionalProperties.$ref,
							fromString,
							mapLeft(
								() =>
									new Error(
										`Unablew to serialize SchemaObject additionalProperties ref "${
											additionalProperties.$ref
										}"`,
									),
							),
							either.map(getSerializedRefType(from)),
						);
					} else {
						return additionalProperties !== true
							? pipe(
									additionalProperties,
									serializeSchemaObjectWithRecursion(from, false, undefined),
							  )
							: right(SERIALIZED_UNKNOWN_TYPE);
					}
				}),
				nullable.map(either.map(getSerializedDictionaryType(name))),
				nullable.map(either.map(checkRecursion(from, shouldTrackRecursion))),
			);
			const properties = pipe(
				schemaObject.properties,
				nullable.map(properties =>
					pipe(
						serializeDictionary(properties, (name, property) => {
							const isRequired = pipe(
								schemaObject.required,
								nullable.map(includes(name)),
								nullable.getOrElse(constFalse),
							);

							if (isReferenceObject(property)) {
								return pipe(
									property.$ref,
									fromString,
									mapLeft(
										() =>
											new Error(
												`Unable to serialize SchemaObject property "${name}" ref "${
													property.$ref
												}"`,
											),
									),
									either.map(getSerializedRefType(from)),
									either.map(getSerializedPropertyType(name, isRequired)),
								);
							} else {
								return pipe(
									property,
									serializeSchemaObjectWithRecursion(from, false, undefined),
									either.map(getSerializedPropertyType(name, isRequired)),
								);
							}
						}),
						sequenceEither,
						either.map(s => intercalateSerializedTypes(serializedType(';', ',', [], []), s)),
						either.map(getSerializedObjectType(name)),
						either.map(checkRecursion(from, shouldTrackRecursion)),
					),
				),
			);
			return pipe(
				additionalProperties,
				nullable.alt(() => properties),
				nullable.getOrElse(() => right(SERIALIZED_UNKNOWN_TYPE)),
			);
		}
	}
};

const checkRecursion = (from: Ref, shouldTrackRecursion: boolean) => (serialized: SerializedType): SerializedType =>
	shouldTrackRecursion && serialized.refs.some(ref => ref.$ref === from.$ref)
		? getSerializedRecursiveType(from)(serialized)
		: serialized;
