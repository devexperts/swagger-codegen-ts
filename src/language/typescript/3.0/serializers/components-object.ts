import { Either, right } from 'fp-ts/lib/Either';
import { directory, Directory, File, file, FSEntity } from '../../../../utils/fs';
import { serializeSchemaObject } from './schema-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { combineEither, sequenceEither, sequenceTEither } from '@devexperts/utils/dist/adt/either.utils';
import { array, either, option, record } from 'fp-ts';
import { serializeDependencies } from '../../common/data/serialized-dependency';
import { context, getIOName, getTypeName } from '../../common/utils';
import { addPathParts, Ref } from '../../../../utils/ref';
import { SchemaObject, SchemaObjectCodec } from '../../../../schema/3.0/schema-object';
import { ComponentsObject } from '../../../../schema/3.0/components-object';
import { ParameterObject, ParameterObjectCodec } from '../../../../schema/3.0/parameter-object';
import { serializeParameterObject } from './parameter-object';
import { ReferenceObject, ReferenceObjectCodec } from '../../../../schema/3.0/reference-object';
import { ResponseObject, ResponseObjectCodec } from '../../../../schema/3.0/response-object';
import { SERIALIZED_VOID_TYPE } from '../../common/data/serialized-type';
import { serializeResponseObject } from './response-object';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { reportIfFailed } from '../../../../utils/io-ts';
import { RequestBodyObject, RequestBodyObjectCodec } from '../../../../schema/3.0/request-body-object';
import { serializeRequestBodyObject } from './request-body-object';

const serializeSchema = (from: Ref, schema: SchemaObject): Either<Error, File> => {
	const typeName = getTypeName(from.name);
	const ioName = getIOName(from.name);
	const serialized = pipe(
		schema,
		serializeSchemaObject(from, typeName),
	);
	const dependencies = pipe(
		serialized,
		either.map(serialized => serializeDependencies(serialized.dependencies)),
	);
	return combineEither(serialized, dependencies, (serialized, dependencies) =>
		file(
			`${from.name}.ts`,
			`
			${dependencies}

			export type ${typeName} = ${serialized.type};
			export const ${ioName} = ${serialized.io};
		`,
		),
	);
};

const serializeSchemas = combineReader(
	context,
	e => (from: Ref, schemas: Record<string, ReferenceObject | SchemaObject>): Either<Error, FSEntity> =>
		pipe(
			schemas,
			record.collect((name, schema) => {
				const resolved = ReferenceObjectCodec.is(schema)
					? e.resolveRef(schema.$ref, SchemaObjectCodec)
					: right(schema);
				const ref = pipe(
					from,
					addPathParts('schemas', name),
				);
				return pipe(
					sequenceTEither(resolved, ref),
					either.chain(([resolved, ref]) => serializeSchema(ref, resolved)),
				);
			}),
			sequenceEither,
			either.map(content => directory('schemas', content)),
		),
);

const serializeParameter = (from: Ref, parameterObject: ParameterObject): Either<Error, File> =>
	pipe(
		serializeParameterObject(from, parameterObject),
		either.map(serialized => {
			const dependencies = serializeDependencies(serialized.dependencies);

			return file(
				`${from.name}.ts`,
				`
					${dependencies}

					export type ${getTypeName(from.name)} = ${serialized.type};
					export const ${getIOName(from.name)} = ${serialized.io};
				`,
			);
		}),
	);

const serializeParameters = combineReader(
	context,
	e => (from: Ref, parameters: Record<string, ReferenceObject | ParameterObject>): Either<Error, FSEntity> =>
		pipe(
			parameters,
			record.collect((name, parameter) => {
				const resolved = ReferenceObjectCodec.is(parameter)
					? e.resolveRef(parameter.$ref, ParameterObjectCodec)
					: right(parameter);
				const ref = pipe(
					from,
					addPathParts('parameters', name),
				);
				return pipe(
					sequenceTEither(resolved, ref),
					either.chain(([parameter, from]) => serializeParameter(from, parameter)),
				);
			}),
			sequenceEither,
			either.map(content => directory('parameters', content)),
		),
);

const serializeResponse = (from: Ref, responseObject: ResponseObject): Either<Error, File> =>
	pipe(
		serializeResponseObject(from, responseObject),
		option.getOrElse(() => right(SERIALIZED_VOID_TYPE)),
		either.map(serialized => {
			const dependencies = serializeDependencies(serialized.dependencies);

			return file(
				`${from.name}.ts`,
				`
					${dependencies}

					export type ${getTypeName(from.name)} = ${serialized.type};
					export const ${getIOName(from.name)} = ${serialized.io};
				`,
			);
		}),
	);

const serializeResponses = combineReader(
	context,
	e => (from: Ref, responses: Record<string, ReferenceObject | ResponseObject>): Either<Error, FSEntity> =>
		pipe(
			responses,
			record.collect((name, response) => {
				const resolved = ReferenceObjectCodec.is(response)
					? e.resolveRef(response.$ref, ResponseObjectCodec)
					: right(response);
				const ref = pipe(
					from,
					addPathParts('responses', name),
				);
				return pipe(
					sequenceTEither(resolved, ref),
					either.chain(([resolved, ref]) => serializeResponse(ref, resolved)),
				);
			}),
			sequenceEither,
			either.map(content => directory('responses', content)),
		),
);

const serializeRequestBody = (from: Ref, requestBody: RequestBodyObject): Either<Error, FSEntity> =>
	pipe(
		serializeRequestBodyObject(from, requestBody),
		either.map(serialized =>
			file(
				`${from.name}.ts`,
				`
					${serializeDependencies(serialized.dependencies)}

					export type ${getTypeName(from.name)} = ${serialized.type};
					export const ${getIOName(from.name)} = ${serialized.io};
				`,
			),
		),
	);

const serializeRequestBodies = combineReader(
	context,
	e => (from: Ref, requestBodies: Record<string, ReferenceObject | RequestBodyObject>): Either<Error, FSEntity> => {
		return pipe(
			requestBodies,
			record.collect((name, requestBody) => {
				const resolved = ReferenceObjectCodec.is(requestBody)
					? e.resolveRef(requestBody.$ref, RequestBodyObjectCodec)
					: right(requestBody);
				const ref = pipe(
					from,
					addPathParts('requestBodies', name),
				);
				return pipe(
					sequenceTEither(resolved, ref),
					either.chain(([resolved, ref]) => serializeRequestBody(ref, resolved)),
				);
			}),
			sequenceEither,
			either.map(content => directory('requestBodies', content)),
		);
	},
);

export const serializeComponentsObject = combineReader(
	serializeParameters,
	serializeResponses,
	serializeSchemas,
	serializeRequestBodies,
	(serializeParameters, serializeResponses, serializeSchemas, serializeRequestBodies) => (from: Ref) => (
		componentsObject: ComponentsObject,
	): Either<Error, Directory> => {
		const schemas = pipe(
			componentsObject.schemas,
			option.map(schemas => serializeSchemas(from, schemas)),
		);
		const parameters = pipe(
			componentsObject.parameters,
			option.map(parameters => serializeParameters(from, parameters)),
		);
		const responses = pipe(
			componentsObject.responses,
			option.map(responses => serializeResponses(from, responses)),
		);
		const requestBodies = pipe(
			componentsObject.requestBodies,
			option.map(requestBodies => serializeRequestBodies(from, requestBodies)),
		);
		return pipe(
			[schemas, parameters, responses, requestBodies],
			array.compact,
			sequenceEither,
			either.map(content => directory('components', content)),
		);
	},
);
