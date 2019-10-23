import { serializedPathParameter, SerializedPathParameter } from '../../common/data/serialized-path-parameter';
import {
	fromSerializedType,
	intercalateSerializedParameters,
	serializedParameter,
	SerializedParameter,
} from '../../common/data/serialized-parameter';
import { serializedDependency } from '../../common/data/serialized-dependency';
import { Either, left, map, mapLeft, right } from 'fp-ts/lib/Either';
import { isPrimitiveSchemaObject, serializeNonArraySchemaObject } from './schema-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { isReferenceObject } from './reference-object';
import { either } from 'fp-ts';
import {
	getSerializedArrayType,
	getSerializedPropertyType,
	getSerializedRefType,
} from '../../common/data/serialized-type';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { unless } from '../../../../utils/string';
import { fromString, Ref } from '../../../../utils/ref';
import { ParameterObject } from '../../../../schema/3.0/parameter-object';
import { ReferenceObject } from '../../../../schema/3.0/reference-object';
import { PrimitiveSchemaObject, SchemaObject } from '../../../../schema/3.0/schema-object';

const serializeParameterReference = (
	from: Ref,
	parameter: ParameterObject,
	reference: ReferenceObject,
): Either<Error, SerializedParameter> =>
	pipe(
		reference.$ref,
		fromString,
		mapLeft(() => new Error(`Invalid $ref "${reference.$ref}" ${forParameter(parameter)}`)),
		either.map(getSerializedRefType(from)),
		either.map(fromSerializedType(parameter.required || false)),
	);

const forParameter = (parameter: ParameterObject): string => `for parameter "${parameter.name}" in "${parameter.in}"`;

const serializePathOrQueryParameterObject = (from: Ref) => (
	parameter: ParameterObject,
): Either<Error, SerializedParameter> => {
	const { schema, required = false } = parameter;
	if (!schema) {
		return left(new Error(`No schema provided ${forParameter(parameter)}`));
	}

	const toSerializedParameter = fromSerializedType(required);

	if (isReferenceObject(schema)) {
		return serializeParameterReference(from, parameter, schema);
	} else {
		switch (schema.type) {
			case 'string':
			case 'number':
			case 'integer':
			case 'boolean': {
				return pipe(
					schema,
					serializeNonArraySchemaObject,
					either.map(toSerializedParameter),
				);
			}
			case 'object': {
				return left(new Error(`"object" type is not supported ${forParameter(parameter)}`));
			}
			case 'array': {
				if (isReferenceObject(schema.items)) {
					return serializeParameterReference(from, parameter, schema.items);
				} else {
					return pipe(
						schema.items,
						validatePrimitiveShemaObject(parameter),
						either.chain(serializeNonArraySchemaObject),
						either.map(getSerializedArrayType()),
						either.map(fromSerializedType(required)),
					);
				}
			}
		}
	}

	return left(new Error(`Serialization failed ${forParameter(parameter)}`));
};

const validatePrimitiveShemaObject = (parameter: ParameterObject) => (
	schema: SchemaObject,
): Either<Error, PrimitiveSchemaObject> =>
	!isPrimitiveSchemaObject(schema)
		? left(new Error(`Array items should be PrimitiveSchemaObjects ${forParameter(parameter)}`))
		: right(schema);

export const serializePathParameterObject = (from: Ref) => (
	parameter: ParameterObject,
): Either<Error, SerializedPathParameter> =>
	pipe(
		parameter,
		serializePathOrQueryParameterObject(from),
		map(serialized =>
			serializedPathParameter(
				parameter.name,
				`${parameter.name}: ${serialized.type}`,
				`${serialized.io}.encode(${parameter.name})`,
				true,
				serialized.dependencies,
				serialized.refs,
			),
		),
	);

export const serializeQueryParameterObject = (from: Ref) => (
	parameter: ParameterObject,
): Either<Error, SerializedParameter> =>
	pipe(
		parameter,
		serializePathOrQueryParameterObject(from),
		either.map(serializedParameterType => {
			const r = getSerializedPropertyType(parameter.name, parameter.required || false)(serializedParameterType);
			return serializedParameter(
				r.type,
				r.io,
				serializedParameterType.isRequired || parameter.required || false,
				serializedParameterType.dependencies.concat(r.dependencies),
				serializedParameterType.refs.concat(r.refs),
			);
		}),
	);

export const foldSerializedQueryParameters = (
	serializedParameters: NonEmptyArray<SerializedParameter>,
): SerializedParameter => {
	const intercalated = intercalateSerializedParameters(
		serializedParameter(';', ',', false, [], []),
		serializedParameters,
	);
	return serializedParameter(
		`query${unless(intercalated.isRequired, '?')}: { ${intercalated.type} }`,
		`query: type({ ${intercalated.io} })`,
		intercalated.isRequired,
		intercalated.dependencies.concat(serializedDependency('type', 'io-ts')),
		intercalated.refs,
	);
};
