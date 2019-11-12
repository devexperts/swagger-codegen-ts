import {
	getSerializedRefType,
	SERIALIZED_NUMBER_TYPE,
	SERIALIZED_BOOLEAN_TYPE,
	SERIALIZED_UNKNOWN_TYPE,
	serializedType,
	SerializedType,
	getSerializedOptionPropertyType,
	intercalateSerializedTypes,
	getSerializedObjectType,
	getSerializedRecursiveType,
	getSerializedDictionaryType,
	getSerializedIntersectionType,
	getSerializedEnumType,
	SERIALIZED_NULL_TYPE,
	getSerializedIntegerType,
	getSerializedStringType,
} from '../../common/data/serialized-type';
import { serializedDependency } from '../../common/data/serialized-dependency';
import {
	AllOfSchemaObject,
	EnumSchemaObjectCodec,
	PrimitiveSchemaObject,
	SchemaObject,
} from '../../../../schema/2.0/schema-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { constFalse } from 'fp-ts/lib/function';
import { includes } from '../../../../utils/array';
import { fromString, Ref } from '../../../../utils/ref';
import { Either, right } from 'fp-ts/lib/Either';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { either, option, record } from 'fp-ts';
import { traverseNEAEither } from '../../../../utils/either';
import { ReferenceObject, ReferenceObjectCodec } from '../../../../schema/2.0/reference-object';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { utilsRef } from '../../common/bundled/utils';

export const serializeSchemaObject = (from: Ref, schema: SchemaObject): Either<Error, SerializedType> =>
	serializeSchemaObjectWithRecursion(from, schema, true);

const serializeSchemaObjectWithRecursion = (
	from: Ref,
	schema: SchemaObject,
	shouldTrackRecursion: boolean,
): Either<Error, SerializedType> => {
	// check non-typed schemas first
	if (ReferenceObjectCodec.is(schema)) {
		return pipe(
			fromString(schema.$ref),
			either.map(getSerializedRefType(from)),
		);
	}

	if (EnumSchemaObjectCodec.is(schema)) {
		return right(getSerializedEnumType(schema.enum));
	}

	if (AllOfSchemaObject.is(schema)) {
		return serializeAllOf(from, schema.allOf, shouldTrackRecursion);
	}

	// schema is typed
	switch (schema.type) {
		case 'null':
		case 'string':
		case 'number':
		case 'integer':
		case 'boolean': {
			return serializePrimitive(from, schema);
		}
		case 'array': {
			return pipe(
				serializeSchemaObjectWithRecursion(from, schema.items, false),
				either.map(result =>
					serializedType(
						`Array<${result.type}>`,
						`array(${result.io})`,
						[...result.dependencies, serializedDependency('array', 'io-ts')],
						result.refs,
					),
				),
			);
		}
		case 'object': {
			const additionalProperties = pipe(
				schema.additionalProperties,
				option.map(additionalProperties =>
					pipe(
						serializeSchemaObjectWithRecursion(from, additionalProperties, false),
						either.map(getSerializedDictionaryType()),
						either.map(getSerializedRecursiveType(from, shouldTrackRecursion)),
					),
				),
			);
			const properties = () =>
				pipe(
					schema.properties,
					option.map(properties =>
						pipe(
							properties,
							record.collect((name, value) => {
								const isRequired = pipe(
									schema.required,
									option.map(includes(name)),
									option.getOrElse(constFalse),
								);
								return pipe(
									serializeSchemaObjectWithRecursion(from, value, false),
									either.map(getSerializedOptionPropertyType(name, isRequired)),
								);
							}),
							sequenceEither,
							either.map(s => intercalateSerializedTypes(serializedType(';', ',', [], []), s)),
							either.map(getSerializedObjectType()),
							either.map(getSerializedRecursiveType(from, shouldTrackRecursion)),
						),
					),
				);

			return pipe(
				additionalProperties,
				option.alt(properties),
				option.getOrElse(() => right(SERIALIZED_UNKNOWN_TYPE)),
			);
		}
	}
};

const serializeAllOf = (
	from: Ref,
	allOf: NonEmptyArray<ReferenceObject | SchemaObject>,
	shouldTrackRecursion: boolean,
): Either<Error, SerializedType> =>
	pipe(
		traverseNEAEither(allOf, item => serializeSchemaObjectWithRecursion(from, item, false)),
		either.map(getSerializedIntersectionType),
		either.map(getSerializedRecursiveType(from, shouldTrackRecursion)),
	);

const serializePrimitive = (from: Ref, schemaObject: PrimitiveSchemaObject): Either<Error, SerializedType> => {
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
