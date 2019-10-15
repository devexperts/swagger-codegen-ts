import { OpenAPIV3 } from 'openapi-types';
import { serializedPathParameter, SerializedPathParameter } from '../../common/data/serialized-path-parameter';
import {
	fromSerializedType,
	intercalateSerializedParameters,
	serializedParameter,
	SerializedParameter,
} from '../../common/data/serialized-parameter';
import { serializedDependency } from '../../common/data/serialized-dependency';
import { Either, left, map, right } from 'fp-ts/lib/Either';
import { isNonEmptyArraySchemaObject, serializeNonArraySchemaObject, serializeSchemaObject } from './schema-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { isReferenceObject, serializeReferenceObject } from './reference-object';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { array, either } from 'fp-ts';
import { fromNullable, sequenceEither } from '../../../../utils/either';
import {
	getSerializedArrayType,
	getSerializedPropertyType,
	intercalateSerializedTypes,
	SerializedType,
	serializedType,
} from '../../common/data/serialized-type';
import { boolean } from 'io-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { unless } from '../../../../utils/string';
import { head } from 'fp-ts/lib/Array';

const serializeParameterReference = combineReader(
	serializeReferenceObject,
	serializeReferenceObject => (
		cwd: string,
		parameter: OpenAPIV3.ParameterObject,
		reference: OpenAPIV3.ReferenceObject,
	): Either<Error, SerializedParameter> =>
		pipe(
			reference,
			serializeReferenceObject(cwd),
			fromNullable(() => new Error(`Unable to resolve $ref "${reference.$ref}" ${forParameter(parameter)}`)),
			either.map(fromSerializedType(Boolean(parameter.required))),
		),
);

const forParameter = (parameter: OpenAPIV3.ParameterObject): string =>
	`for parameter "${parameter.name}" in "${parameter.in}"`;

const serializePathOrQueryParameterObject = combineReader(
	serializeParameterReference,
	serializeParameterReference => (cwd: string) => (
		parameter: OpenAPIV3.ParameterObject,
	): Either<Error, SerializedParameter> => {
		const { schema, required = false } = parameter;
		if (!schema) {
			return left(new Error(`No schema provided ${forParameter(parameter)}`));
		}

		const toSerializedParameter = fromSerializedType(required);

		if (isReferenceObject(schema)) {
			return serializeParameterReference(cwd, parameter, schema);
		} else {
			switch (schema.type) {
				case 'null':
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
						return serializeParameterReference(cwd, parameter, schema.items);
					} else {
						return pipe(
							schema.items,
							validateNonEmptyArraySchemaObjects(parameter),
							either.chain(serializeNonArraySchemaObject),
							either.map(getSerializedArrayType),
							either.map(fromSerializedType(required)),
						);
					}
				}
			}
		}

		return left(new Error(`Serialization failed ${forParameter(parameter)}`));
	},
);

const validateNonEmptyArraySchemaObjects = (parameter: OpenAPIV3.ParameterObject) => (
	schema: OpenAPIV3.SchemaObject,
): Either<Error, OpenAPIV3.NonArraySchemaObject> =>
	!isNonEmptyArraySchemaObject(schema)
		? left(new Error(`Array items should be NonEmptyArraySchemaObjects ${forParameter(parameter)}`))
		: right(schema);

export const serializePathParameterObject = combineReader(
	serializePathOrQueryParameterObject,
	serializePathOrQueryParameterObject => (cwd: string) => (
		parameter: OpenAPIV3.ParameterObject,
	): Either<Error, SerializedPathParameter> =>
		pipe(
			parameter,
			serializePathOrQueryParameterObject(cwd),
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
		),
);

export const serializeQueryParameterObject = combineReader(
	serializePathOrQueryParameterObject,
	serializePathOrQueryParameterObject => (cwd: string) => (
		parameter: OpenAPIV3.ParameterObject,
	): Either<Error, SerializedParameter> =>
		pipe(
			parameter,
			serializePathOrQueryParameterObject(cwd),
			either.map(serializedParameterType => {
				const r = getSerializedPropertyType(
					parameter.name,
					serializedParameterType.type,
					serializedParameterType.io,
					parameter.required || false,
				);
				return serializedParameter(
					r.type,
					r.io,
					serializedParameterType.isRequired || parameter.required || false,
					serializedParameterType.dependencies.concat(r.dependencies),
					serializedParameterType.refs.concat(r.refs),
				);
			}),
		),
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

export const serializeBodyParameterObject = combineReader(
	serializeSchemaObject,
	serializeParameterReference,
	(serializeSchemaObject, serializeParameterReference) => (rootName: string, cwd: string) => (
		parameter: OpenAPIV3.ParameterObject,
	): Either<Error, SerializedParameter> => {
		const { schema, required = false } = parameter;
		if (!schema) {
			return left(new Error(`No schema provided ${forParameter(parameter)}`));
		}
		if (isReferenceObject(schema)) {
			return serializeParameterReference(cwd, parameter, schema);
		} else {
			return pipe(
				schema,
				serializeSchemaObject(rootName, cwd),
				either.map(fromSerializedType(required)),
			);
		}
	},
);

export const foldSerializedBodyParameters = (
	serializedParameters: SerializedParameter[],
): Either<Error, SerializedParameter> => {
	return pipe(
		serializedParameters,
		// according to spec there can be only one body parameter
		head,
		either.fromOption(() => new Error('Only one parameter in "body" is possible')),
		either.map(serialized =>
			serializedParameter(
				`body${unless(serialized.isRequired, '?')}: ${serialized.type}`,
				`body: ${serialized.io}`,
				serialized.isRequired,
				serialized.dependencies,
				serialized.refs,
			),
		),
	);
};
