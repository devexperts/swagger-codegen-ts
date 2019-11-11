import {
	getSerializedArrayType,
	getSerializedDictionaryType,
	getSerializedEnumType,
	getSerializedIntegerType,
	getSerializedIntersectionType,
	getSerializedObjectType,
	getSerializedPropertyType,
	getSerializedRecursiveType,
	getSerializedRefType,
	getSerializedStringType,
	getSerializedUnionType,
	intercalateSerializedTypes,
	SERIALIZED_BOOLEAN_TYPE,
	SERIALIZED_NUMBER_TYPE,
	SERIALIZED_UNKNOWN_TYPE,
	SerializedType,
	serializedType,
} from '../../common/data/serialized-type';
import { Either, mapLeft, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, option } from 'fp-ts';
import { serializeDictionary } from '../../../../utils/types';
import { constFalse } from 'fp-ts/lib/function';
import { includes } from '../../../../utils/array';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { fromString, Ref } from '../../../../utils/ref';
import {
	AllOfSchemaObjectCodec,
	EnumSchemaObjectCodec,
	OneOfSchemaObjectCodec,
	SchemaObject,
	PrimitiveSchemaObject,
} from '../../../../schema/3.0/schema-object';
import { ReferenceObject, ReferenceObjectCodec } from '../../../../schema/3.0/reference-object';
import { traverseNEAEither } from '../../../../utils/either';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { utilsRef } from '../../common/bundled/utils';

type AdditionalProperties = boolean | ReferenceObject | SchemaObject;
type AllowedAdditionalProperties = true | ReferenceObject | SchemaObject;
const isAllowedAdditionalProperties = (
	additionalProperties: AdditionalProperties,
): additionalProperties is AllowedAdditionalProperties => additionalProperties !== false;

export const serializeSchemaObject = (
	from: Ref,
	name?: string,
): ((schemaObject: SchemaObject) => Either<Error, SerializedType>) =>
	serializeSchemaObjectWithRecursion(from, true, name);

const serializeSchemaObjectWithRecursion = (from: Ref, shouldTrackRecursion: boolean, name?: string) => (
	schemaObject: SchemaObject,
): Either<Error, SerializedType> => {
	if (OneOfSchemaObjectCodec.is(schemaObject)) {
		return pipe(
			serializeChildren(from, schemaObject.oneOf),
			either.map(getSerializedUnionType),
			either.map(getSerializedRecursiveType(from, shouldTrackRecursion)),
		);
	}

	if (AllOfSchemaObjectCodec.is(schemaObject)) {
		return pipe(
			serializeChildren(from, schemaObject.allOf),
			either.map(getSerializedIntersectionType),
			either.map(getSerializedRecursiveType(from, shouldTrackRecursion)),
		);
	}

	if (EnumSchemaObjectCodec.is(schemaObject)) {
		return right(getSerializedEnumType(schemaObject.enum));
	}

	switch (schemaObject.type) {
		case 'string':
		case 'boolean':
		case 'integer':
		case 'number': {
			return serializePrimitive(from, schemaObject);
		}
		case 'array': {
			const { items } = schemaObject;
			const serialized = ReferenceObjectCodec.is(items)
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
					if (ReferenceObjectCodec.is(additionalProperties)) {
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
				option.map(either.map(getSerializedRecursiveType(from, shouldTrackRecursion))),
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

							if (ReferenceObjectCodec.is(property)) {
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
						either.map(getSerializedRecursiveType(from, shouldTrackRecursion)),
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

const serializeChildren = (
	from: Ref,
	children: NonEmptyArray<ReferenceObject | SchemaObject>,
): Either<Error, NonEmptyArray<SerializedType>> =>
	traverseNEAEither(children, item =>
		ReferenceObjectCodec.is(item)
			? pipe(
					fromString(item.$ref),
					either.map(getSerializedRefType(from)),
			  )
			: serializeSchemaObjectWithRecursion(from, false)(item),
	);

const serializePrimitive = (from: Ref, schemaObject: PrimitiveSchemaObject): Either<Error, SerializedType> => {
	switch (schemaObject.type) {
		case 'string': {
			return right(getSerializedStringType(schemaObject.format));
		}
		case 'number': {
			return right(SERIALIZED_NUMBER_TYPE);
		}
		case 'integer': {
			return pipe(
				utilsRef,
				either.map(utilsRef => getSerializedIntegerType(from, utilsRef)),
			);
		}
		case 'boolean': {
			return right(SERIALIZED_BOOLEAN_TYPE);
		}
	}
};
