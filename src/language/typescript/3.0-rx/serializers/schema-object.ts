import { OpenAPIV3 } from 'openapi-types';
import {
	foldSerializedTypes,
	SERIALIZED_UNKNOWN_TYPE,
	SerializedType,
	serializedType,
	getSerializedArrayType,
	getSerializedRefType,
} from '../../common/data/serialized-type';
import { OPTION_DEPENDENCIES, serializedDependency } from '../../common/data/serialized-dependency';
import { Either, left, mapLeft, right } from 'fp-ts/lib/Either';
import { isReferenceObject } from './reference-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import * as nullable from '../../../../utils/nullable';
import { isNonNullable, Nullable } from '../../../../utils/nullable';
import { serializeDictionary } from '../../../../utils/types';
import { constFalse } from 'fp-ts/lib/function';
import { concatIfL, includes } from '../../../../utils/array';
import { fromNullable, sequenceEither } from '../../../../utils/either';
import { recursion } from 'io-ts';
import { getIOName } from '../../common/utils';
import { fromString } from '../../../../utils/ref';

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

const serializeAdditionalProperties = (rootName: string, cwd: string) => (
	additionalProperties: true | OpenAPIV3.SchemaObject,
): Either<Error, SerializedType> =>
	additionalProperties !== true
		? pipe(
				additionalProperties,
				serializeSchemaObject(rootName, cwd),
				either.map(serialized =>
					serializedType(
						`{[key: string]: ${serialized.type}}`,
						`record(string, ${serialized.io})`,
						[
							...serialized.dependencies,
							serializedDependency('string', 'io-ts'),
							serializedDependency('record', 'io-ts'),
						],
						serialized.refs,
					),
				),
		  )
		: right(serializedType('{[key: string]: unknown}', 'unknown', [serializedDependency('unknown', 'io-ts')], []));

export const serializeSchemaObject = (rootName: string, cwd: string) => (
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
			if (isReferenceObject(items)) {
				return pipe(
					items.$ref,
					fromString,
					mapLeft(() => new Error(`Unable to serialize SchemaObjeft array items ref "${items.$ref}"`)),
					either.map(getSerializedRefType(cwd)),
					either.map(getSerializedArrayType),
				);
			} else {
				return pipe(
					items,
					serializeSchemaObject(rootName, cwd),
					either.map(getSerializedArrayType),
				);
			}
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
							either.map(getSerializedRefType(cwd)),
						);
					} else {
						return serializeAdditionalProperties(rootName, cwd)(additionalProperties);
					}
				}),
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
									either.map(getSerializedRefType(cwd)),
									either.map(toPropertyType(name, isRequired)),
								);
							} else {
								return pipe(
									property,
									serializeSchemaObject(rootName, cwd),
									either.map(toPropertyType(name, isRequired)),
								);
							}
						}),
						sequenceEither,
						either.map(types => {
							const serialized = foldSerializedTypes(types);
							return toObjectType(
								serialized.refs.some(ref => ref.name === rootName) ? rootName : undefined,
							)(serialized);
						}),
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

const toPropertyType = (name: string, isRequired: boolean) => (serialized: SerializedType): SerializedType =>
	isRequired
		? serializedType(
				`${name}: ${serialized.type};`,
				`${name}: ${serialized.io},`,
				serialized.dependencies,
				serialized.refs,
		  )
		: serializedType(
				`${name}: Option<${serialized.type}>;`,
				`${name}: optionFromNullable(${serialized.io}),`,
				[...serialized.dependencies, ...OPTION_DEPENDENCIES],
				serialized.refs,
		  );

const toObjectType = (recursion: Nullable<string>) => (serialized: SerializedType): SerializedType => {
	const io = `type({ ${serialized.io} })`;
	return serializedType(
		`{ ${serialized.type} }`,
		pipe(
			recursion,
			nullable.map(recursion => {
				const recursionIO = getIOName(recursion);
				return `recursion<${recursion}, unknown>('${recursionIO}', ${recursionIO} => ${io})`;
			}),
			nullable.getOrElse(() => io),
		),
		concatIfL(isNonNullable(recursion), [...serialized.dependencies, serializedDependency('type', 'io-ts')], () => [
			serializedDependency('recursion', 'io-ts'),
		]),
		[],
	);
};
