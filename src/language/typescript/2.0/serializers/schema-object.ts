import {
	getSerializedRefType,
	SERIALIZED_NUMERIC_TYPE,
	SERIALIZED_BOOLEAN_TYPE,
	SERIALIZED_UNKNOWN_TYPE,
	serializedType,
	SerializedType,
	SERIALIZED_DATE_TYPE,
	SERIALIZED_STRING_TYPE,
	getSerializedPropertyType,
	intercalateSerializedTypes,
	getSerializedObjectType,
	getSerializedRecursiveType,
	getSerializedDictionaryType,
} from '../../common/data/serialized-type';
import { monoidDependencies, serializedDependency } from '../../common/data/serialized-dependency';
import { AllOfSchemaObject, SchemaObject } from '../../../../schema/2.0/schema-object/schema-object';
import { none, some } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold, monoidString } from 'fp-ts/lib/Monoid';
import { intercalate } from 'fp-ts/lib/Foldable';
import { constFalse } from 'fp-ts/lib/function';
import { includes } from '../../../../utils/array';
import { fromString, Ref } from '../../../../utils/ref';
import { Either, right } from 'fp-ts/lib/Either';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { array, either, option, record } from 'fp-ts';
import { traverseArrayEither } from '../../../../utils/either';
import { ReferenceObject } from '../../../../schema/2.0/reference-object';

export const serializeSchemaObject = (from: Ref, schema: SchemaObject): Either<Error, SerializedType> =>
	serializeSchemaObjectWithRecursion(from, schema, true);

const serializeSchemaObjectWithRecursion = (
	from: Ref,
	schema: SchemaObject,
	shouldTrackRecursion: boolean,
): Either<Error, SerializedType> => {
	// check non-typed schemas first
	if (ReferenceObject.is(schema)) {
		return pipe(
			fromString(schema.$ref),
			either.map(getSerializedRefType(from)),
		);
	}

	if (AllOfSchemaObject.is(schema)) {
		return pipe(
			traverseArrayEither(schema.allOf, item => serializeSchemaObject(from, item)),
			either.map(results => {
				const types = results.map(item => item.type);
				const ios = results.map(item => item.io);
				const dependencies = fold(monoidDependencies)(results.map(item => item.dependencies));
				const refs = fold(array.getMonoid<Ref>())(results.map(item => item.refs));

				return serializedType(
					intercalate(monoidString, array.array)(' & ', types),
					`intersection([${intercalate(monoidString, array.array)(', ', ios)}])`,
					[serializedDependency('intersection', 'io-ts'), ...dependencies],
					refs,
				);
			}),
		);
	}

	// schema is typed
	switch (schema.type) {
		case 'string': {
			return pipe(
				schema.enum,
				option.map(serializeEnum),
				option.alt(() =>
					pipe(
						schema.format,
						option.chain(format => {
							switch (format) {
								case 'date-time': {
									return some(SERIALIZED_DATE_TYPE);
								}
							}
							return none;
						}),
					),
				),
				option.getOrElse(() => SERIALIZED_STRING_TYPE),
				right,
			);
		}
		case 'boolean': {
			return right(SERIALIZED_BOOLEAN_TYPE);
		}
		case 'integer':
		case 'number': {
			return right(SERIALIZED_NUMERIC_TYPE);
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
									either.map(getSerializedPropertyType(name, isRequired)),
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

const serializeEnum = (enumValue: Array<string | number | boolean>): SerializedType => {
	const type = enumValue.map(value => `'${value}'`).join(' | ');
	const io =
		enumValue.length === 1
			? `literal(${type})`
			: `union([${enumValue.map(value => `literal('${value}')`).join(',')}])`;
	return serializedType(
		type,
		io,
		[serializedDependency('union', 'io-ts'), serializedDependency('literal', 'io-ts')],
		[],
	);
};
