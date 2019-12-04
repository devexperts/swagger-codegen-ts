import { fromString, Ref } from '../../../../utils/ref';
import { Either, right } from 'fp-ts/lib/Either';
import {
	getSerializedArrayType,
	getSerializedDictionaryType,
	getSerializedIntersectionType,
	getSerializedObjectType,
	getSerializedOptionPropertyType,
	getSerializedRecursiveType,
	getSerializedRefType,
	getSerializedUnionType,
	intercalateSerializedTypes,
	getSerializedPrimitiveType,
	SERIALIZED_BOOLEAN_TYPE,
	SERIALIZED_NULL_TYPE,
	SERIALIZED_NUMBER_TYPE,
	SERIALIZED_UNKNOWN_TYPE,
	serializedType,
	SerializedType,
	getSerializedEnumType,
	getSerializedStringType,
	SERIALIZED_INTEGER_TYPE,
} from '../../common/data/serialized-type';
import {
	AllOfSchemaObjectCodec,
	ConstSchemaObjectCodec,
	EnumSchemaObjectCodec,
	ObjectSchemaObject,
	OneOfSchemaObjectCodec,
	SchemaObject,
} from '../../../../schema/asyncapi-2.0.0/schema-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, option, record } from 'fp-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { ReferenceObject, ReferenceObjectCodec } from '../../../../schema/asyncapi-2.0.0/reference-object';
import { traverseNEAEither } from '../../../../utils/either';
import { constFalse } from 'fp-ts/lib/function';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { Option } from 'fp-ts/lib/Option';

export const serializeSchemaObject = (
	from: Ref,
	schemaObject: SchemaObject,
	name?: string,
): Either<Error, SerializedType> => serializeSchemaObjectWithRecursion(from, schemaObject, true, name);

const serializeSchemaObjectWithRecursion = (
	from: Ref,
	schemaObject: SchemaObject,
	shouldTrackRecursion: boolean,
	name?: string,
): Either<Error, SerializedType> => {
	// check non-types schemas
	if (EnumSchemaObjectCodec.is(schemaObject)) {
		return right(getSerializedEnumType(schemaObject.enum));
	}
	if (ConstSchemaObjectCodec.is(schemaObject)) {
		return right(getSerializedPrimitiveType(schemaObject.const));
	}
	if (AllOfSchemaObjectCodec.is(schemaObject)) {
		return serializeAllOf(from, schemaObject.allOf, shouldTrackRecursion);
	}
	if (OneOfSchemaObjectCodec.is(schemaObject)) {
		return serializeOneOf(from, schemaObject.oneOf, shouldTrackRecursion);
	}

	// schema is typed at this point
	switch (schemaObject.type) {
		case 'null': {
			return right(SERIALIZED_NULL_TYPE);
		}
		case 'string': {
			return right(getSerializedStringType(schemaObject.format));
		}
		case 'number': {
			return right(SERIALIZED_NUMBER_TYPE);
		}
		case 'integer': {
			return right(SERIALIZED_INTEGER_TYPE);
		}
		case 'boolean': {
			return right(SERIALIZED_BOOLEAN_TYPE);
		}
		case 'object': {
			return serializeObjectSchemaObject(from, schemaObject, shouldTrackRecursion, name);
		}
		case 'array': {
			return serializeArray(from, schemaObject.items, shouldTrackRecursion, name);
		}
	}
};

const serializeChildren = (
	from: Ref,
	value: NonEmptyArray<ReferenceObject | SchemaObject>,
): Either<Error, NonEmptyArray<SerializedType>> =>
	traverseNEAEither(value, item =>
		ReferenceObjectCodec.is(item)
			? pipe(
					fromString(item.$ref),
					either.map(getSerializedRefType(from)),
			  )
			: serializeSchemaObjectWithRecursion(from, item, false),
	);

const serializeAllOf = (
	from: Ref,
	value: NonEmptyArray<ReferenceObject | SchemaObject>,
	shouldTrackRecursion: boolean,
): Either<Error, SerializedType> =>
	pipe(
		serializeChildren(from, value),
		either.map(getSerializedIntersectionType),
		either.map(getSerializedRecursiveType(from, shouldTrackRecursion)),
	);

const serializeOneOf = (
	from: Ref,
	value: NonEmptyArray<ReferenceObject | SchemaObject>,
	shouldTrackRecursion: boolean,
): Either<Error, SerializedType> =>
	pipe(
		serializeChildren(from, value),
		either.map(getSerializedUnionType),
		either.map(getSerializedRecursiveType(from, shouldTrackRecursion)),
	);

const serializeObjectSchemaObject = (
	from: Ref,
	value: ObjectSchemaObject,
	shouldTrackRecursion: boolean,
	name?: string,
): Either<Error, SerializedType> =>
	pipe(
		value.additionalProperties,
		option.map(properties => serializeAdditionalProperties(from, properties, shouldTrackRecursion, name)),
		option.alt(() => serializeProperties(from, value, shouldTrackRecursion, name)),
		option.getOrElse(() => right(SERIALIZED_UNKNOWN_TYPE)),
	);

const serializeAdditionalProperties = (
	from: Ref,
	properties: ReferenceObject | SchemaObject,
	shouldTrackRecursion: boolean,
	name?: string,
): Either<Error, SerializedType> => {
	const serialized = ReferenceObjectCodec.is(properties)
		? pipe(
				fromString(properties.$ref),
				either.map(getSerializedRefType(from)),
		  )
		: serializeSchemaObjectWithRecursion(from, properties, false);
	return pipe(
		serialized,
		either.map(getSerializedDictionaryType(name)),
		either.map(getSerializedRecursiveType(from, shouldTrackRecursion)),
	);
};

const serializeProperties = (
	from: Ref,
	schemaObject: ObjectSchemaObject,
	shouldTrackRecursion: boolean,
	name?: string,
): Option<Either<Error, SerializedType>> =>
	pipe(
		schemaObject.properties,
		option.map(properties =>
			pipe(
				properties,
				record.collect((name, property) => {
					const isRequired = pipe(
						schemaObject.required,
						option.map(required => required.has(name)),
						option.getOrElse(constFalse),
					);

					const serialized = ReferenceObjectCodec.is(property)
						? pipe(
								fromString(property.$ref),
								either.map(getSerializedRefType(from)),
						  )
						: serializeSchemaObjectWithRecursion(from, property, false);

					return pipe(
						serialized,
						either.map(getSerializedOptionPropertyType(name, isRequired)),
					);
				}),
				sequenceEither,
				either.map(s => intercalateSerializedTypes(serializedType(';', ',', [], []), s)),
				either.map(getSerializedObjectType(name)),
				either.map(getSerializedRecursiveType(from, shouldTrackRecursion)),
			),
		),
	);

const serializeArray = (
	from: Ref,
	items: ReferenceObject | SchemaObject,
	shouldTrackRecursion: boolean,
	name?: string,
): Either<Error, SerializedType> => {
	const serialized = ReferenceObjectCodec.is(items)
		? pipe(
				fromString(items.$ref),
				either.map(getSerializedRefType(from)),
		  )
		: serializeSchemaObjectWithRecursion(from, items, false);
	return pipe(
		serialized,
		either.map(getSerializedArrayType(name)),
	);
};
