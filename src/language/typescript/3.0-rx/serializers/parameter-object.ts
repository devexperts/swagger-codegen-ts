import { OpenAPIV3 } from 'openapi-types';
import { serializedPathParameter, SerializedPathParameter } from '../../common/data/serialized-path-parameter';
import { serializedParameter, SerializedParameter } from '../../common/data/serialized-parameter';
import { dependency } from '../../common/data/serialized-dependency';
import { chain, Either, left, map, right } from 'fp-ts/lib/Either';
import { isNonEmptyArraySchemaObject, serializeNonArraySchemaObject } from './schema-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from '../../../../utils/nullable';
import { Dereference, resolveReference } from '../utils';
import { addReferenceDependencies } from './reference-object';

export const serializePathParameterObject = (dereference: Dereference) => (
	parameter: OpenAPIV3.ParameterObject,
): Either<Error, SerializedPathParameter> => {
	return pipe(
		serializePathOrQueryParameterObject(dereference)(parameter),
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
};

export const serializePathParameterObjectDescription = (dereference: Dereference) => (
	parameter: OpenAPIV3.ParameterObject,
): Either<Error, string> =>
	pipe(
		serializePathOrQueryParameterObject(dereference)(parameter),
		map(serialized => {
			const description = pipe(
				parameter.description,
				fold(() => '', d => `- ${d}`),
			);
			return `@param { ${serialized.type} } ${parameter.name} ${description}`;
		}),
	);

const serializePathOrQueryParameterObject = (dereference: Dereference) => (
	parameter: OpenAPIV3.ParameterObject,
): Either<Error, SerializedParameter> => {
	const { schema, required = false } = parameter;
	if (schema) {
		const resolved = resolveReference(dereference, schema, handleMiss(parameter));
		return pipe(
			resolved,
			chain(resolved => {
				switch (resolved.type) {
					case 'null':
					case 'string':
					case 'number':
					case 'integer':
					case 'boolean': {
						return pipe(
							serializeNonArraySchemaObject(resolved),
							map(serialized => ({
								...serialized,
								isRequired: required,
							})),
						);
					}
					case 'object': {
						return left(new Error(`"object" type is not supported ${forParameter(parameter)}`));
					}
					case 'array': {
						return pipe(
							resolveReference(dereference, resolved.items, handleMiss(parameter)),
							chain(validateNonEmptyArraySchemaObjects(parameter)),
							chain(serializeNonArraySchemaObject),
							map(serialized =>
								serializedParameter(
									`Array<${serialized.type}>`,
									`array(${serialized.io})`,
									required,
									[...serialized.dependencies, dependency('array', 'io-ts')],
									serialized.refs,
								),
							),
							chain(addReferenceDependencies(resolved.items)),
						);
					}
				}
			}),
			chain(addReferenceDependencies(schema)),
		);
	}
	return left(new Error(`No schema provided for parameter: ${parameter.name} in ${parameter.in}`));
};

const forParameter = (parameter: OpenAPIV3.ParameterObject): string =>
	`for parameter "${parameter.name}" in "${parameter.in}"`;

const handleMiss = (parameter: OpenAPIV3.ParameterObject) => ($ref: string) =>
	new Error(`Unable to resolve $ref "${$ref}" ${forParameter(parameter)}`);

const validateNonEmptyArraySchemaObjects = (parameter: OpenAPIV3.ParameterObject) => (
	schema: OpenAPIV3.SchemaObject,
): Either<Error, OpenAPIV3.NonArraySchemaObject> =>
	!isNonEmptyArraySchemaObject(schema)
		? left(new Error(`Array items should be NonEmptyArraySchemaObjects ${forParameter(parameter)}`))
		: right(schema);

