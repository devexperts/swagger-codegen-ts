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
import { Either, mapLeft, right } from 'fp-ts/lib/Either';
import { isReferenceObject } from './reference-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, option } from 'fp-ts';
import { serializeDictionary } from '../../../../utils/types';
import { constFalse } from 'fp-ts/lib/function';
import { includes } from '../../../../utils/array';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { fromString, Ref } from '../../../../utils/ref';
import { PrimitiveSchemaObject, SchemaObject } from '../../../../schema/3.0/schema-object';
import { ReferenceObject } from '../../../../schema/3.0/reference-object';

type AdditionalProperties = boolean | ReferenceObject | SchemaObject;
type AllowedAdditionalProperties = true | ReferenceObject | SchemaObject;
const isAllowedAdditionalProperties = (
	additionalProperties: AdditionalProperties,
): additionalProperties is AllowedAdditionalProperties => additionalProperties !== false;

export const serializeNonArraySchemaObject = (schemaObject: PrimitiveSchemaObject): Either<Error, SerializedType> => {
	switch (schemaObject.type) {
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
	}
};

export const isPrimitiveSchemaObject = (schemaObject: SchemaObject): schemaObject is PrimitiveSchemaObject =>
	['boolean', 'number', 'string', 'integer'].includes(schemaObject.type);

export const serializeSchemaObject = (
	from: Ref,
	name?: string,
): ((schemaObject: SchemaObject) => Either<Error, SerializedType>) =>
	serializeSchemaObjectWithRecursion(from, true, name);

const serializeSchemaObjectWithRecursion = (from: Ref, shouldTrackRecursion: boolean, name?: string) => (
	schemaObject: SchemaObject,
): Either<Error, SerializedType> => {
	switch (schemaObject.type) {
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
				option.filter(isAllowedAdditionalProperties),
				option.map(additionalProperties => {
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
				option.map(either.map(getSerializedDictionaryType(name))),
				option.map(either.map(checkRecursion(from, shouldTrackRecursion))),
			);
			const properties = pipe(
				schemaObject.properties,
				option.map(properties =>
					pipe(
						serializeDictionary(properties, (name, property) => {
							const isRequired = pipe(
								schemaObject.required,
								option.map(includes(name)),
								option.getOrElse(constFalse),
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
				option.alt(() => properties),
				option.getOrElse(() => right(SERIALIZED_UNKNOWN_TYPE)),
			);
		}
	}
};

const checkRecursion = (from: Ref, shouldTrackRecursion: boolean) => (serialized: SerializedType): SerializedType =>
	shouldTrackRecursion && serialized.refs.some(ref => ref.$ref === from.$ref)
		? getSerializedRecursiveType(from)(serialized)
		: serialized;
