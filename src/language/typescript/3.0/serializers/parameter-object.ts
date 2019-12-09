import { fromSerializedType, SerializedParameter } from '../../common/data/serialized-parameter';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { serializeSchemaObject } from './schema-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, option, record } from 'fp-ts';
import { getSerializedRefType, SerializedType } from '../../common/data/serialized-type';
import { fromString, getRelativePath, Ref } from '../../../../utils/ref';
import { ParameterObject, ParameterObjectStyle } from '../../../../schema/3.0/parameter-object';
import { ReferenceObject, ReferenceObjectCodec } from '../../../../schema/3.0/reference-object';
import { constFalse } from 'fp-ts/lib/function';
import {
	PrimitiveSchemaObjectCodec,
	SchemaObject,
	ArraySchemaObjectCodec,
	ObjectSchemaObjectCodec,
} from '../../../../schema/3.0/schema-object';
import {
	serializedFragment,
	SerializedFragment,
	getSerializedOptionCallFragment,
} from '../../common/data/serialized-fragment';
import { serializedDependency } from '../../common/data/serialized-dependency';
import { openapi3utilsRef } from '../bundled/openapi-3-utils';

const forParameter = (parameter: ParameterObject): string => `for parameter "${parameter.name}" in "${parameter.in}"`;

export const isRequired = (parameter: ParameterObject): boolean =>
	parameter.in === 'path' ? parameter.required : pipe(parameter.required, option.getOrElse(constFalse));

export const serializeParameterObject = (
	from: Ref,
	parameterObject: ParameterObject,
): Either<Error, SerializedParameter> =>
	pipe(
		getParameterObjectSchema(parameterObject),
		either.chain(schema => {
			if (ReferenceObjectCodec.is(schema)) {
				return pipe(fromString(schema.$ref), either.map(getSerializedRefType(from)));
			} else {
				return pipe(schema, serializeSchemaObject(from));
			}
		}),
		either.map(fromSerializedType(isRequired(parameterObject))),
	);

export const getParameterObjectSchema = (
	parameterObject: ParameterObject,
): Either<Error, ReferenceObject | SchemaObject> =>
	pipe(
		parameterObject.schema,
		option.alt(() =>
			pipe(
				parameterObject.content,
				option.chain(content => record.lookup('application/json', content)),
				option.chain(media => media.schema),
			),
		),
		either.fromOption(() => new Error(`Unable to get schema ${forParameter(parameterObject)}`)),
	);

const getParameterObjectStyle = (parameter: ParameterObject): ParameterObjectStyle =>
	pipe(
		parameter.style,
		option.getOrElse<ParameterObjectStyle>(() => {
			switch (parameter.in) {
				case 'path': {
					return 'simple';
				}
				case 'header': {
					return 'simple';
				}
				case 'query': {
					return 'form';
				}
				case 'cookie': {
					return 'form';
				}
			}
		}),
	);

const getParameterExplode = (parameter: ParameterObject): boolean =>
	pipe(
		parameter.explode,
		option.getOrElse(() => getParameterObjectStyle(parameter) === 'form'),
	);

export const serializeParameterToTemplate = (
	from: Ref,
	parameter: ParameterObject,
	parameterSchema: SchemaObject,
	serializedSchema: SerializedType,
	target: string,
): Either<Error, SerializedFragment> => {
	if (isLeft(openapi3utilsRef)) {
		return openapi3utilsRef;
	}
	const pathToUtils = getRelativePath(from, openapi3utilsRef.right);
	const required = isRequired(parameter);

	const encoded = serializedFragment(
		`${serializedSchema.io}.encode(${target}.${parameter.name})`,
		serializedSchema.dependencies,
		serializedSchema.refs,
	);

	return pipe(
		getFn(pathToUtils, parameterSchema, parameter),
		either.map(fn => getSerializedOptionCallFragment(!required, fn, encoded)),
	);
};

const getFn = (
	pathToUtils: string,
	schema: SchemaObject,
	parameter: ParameterObject,
): Either<Error, SerializedFragment> => {
	const explode = getParameterExplode(parameter);
	const style = getParameterObjectStyle(parameter);

	if (PrimitiveSchemaObjectCodec.is(schema)) {
		return right(
			serializedFragment(
				`value => serializePrimitiveParameter('${style}', '${parameter.name}', value)`,
				[serializedDependency('serializePrimitiveParameter', pathToUtils)],
				[],
			),
		);
	}
	if (ArraySchemaObjectCodec.is(schema)) {
		return right(
			serializedFragment(
				`value => serializeArrayParameter('${style}', '${parameter.name}', value, ${explode})`,
				[serializedDependency('serializeArrayParameter', pathToUtils)],
				[],
			),
		);
	}
	if (ObjectSchemaObjectCodec.is(schema)) {
		return right(
			serializedFragment(
				`value => serializeObjectParameter('${style}', '${parameter.name}', value, ${explode})`,
				[serializedDependency('serializeObjectParameter', pathToUtils)],
				[],
			),
		);
	}
	return left(new Error(`Unsupported schema for parameter "${parameter.name}"`));
};
