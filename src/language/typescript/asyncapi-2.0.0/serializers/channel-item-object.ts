import { getRelativePath, Ref } from '../../../../utils/ref';
import { ChannelItemObject } from '../../../../schema/asyncapi-2.0.0/channel-item-object';
import { Either, left, right } from 'fp-ts/lib/Either';
import {
	getSerializedPropertyType,
	getSerializedOptionPropertyType,
	intercalateSerializedTypes,
	serializedType,
	SerializedType,
} from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, option, record } from 'fp-ts';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { serializePublishOperationObject, serializeSubscribeOperationObject } from './operation-object';
import { foldKind, Kind } from '../../../../utils/types';
import { serializedDependency } from '../../common/data/serialized-dependency';
import { clientRef } from '../../common/bundled/client';
import { serializeSchemaObject } from './schema-object';
import { ObjectSchemaObject } from '../../../../schema/asyncapi-2.0.0/schema-object';
import { fromEither, isSome } from 'fp-ts/lib/Option';
import { sequenceTOption } from '@devexperts/utils/dist/adt/option.utils';
import { constFalse } from 'fp-ts/lib/function';
import { when } from '../../../../utils/string';
import {
	fromSerializedType,
	intercalateSerializedParameters,
	serializedParameter,
} from '../../common/data/serialized-parameter';
import {
	SerializedPathParameter,
	getSerializedPathParameterType,
	serializedPathParameter,
} from '../../common/data/serialized-path-parameter';
import { concatIf } from '../../../../utils/array';
import { context, getURL } from '../../common/utils';
import { ParametersObject, ParametersObjectPattern } from '../../../../schema/asyncapi-2.0.0/parameters-object';
import { ReferenceObject, ReferenceObjectCodec } from '../../../../schema/asyncapi-2.0.0/reference-object';
import { ParameterObject, ParameterObjectCodec } from '../../../../schema/asyncapi-2.0.0/parameter-object';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';

const serializeChannelPathParameters = combineReader(context, e => (from: Ref, params: ParametersObject) =>
	pipe(
		params,
		record.collect((key: ParametersObjectPattern, param: ReferenceObject | ParameterObject) => {
			const parameter = ReferenceObjectCodec.is(param)
				? fromEither(e.resolveRef(param.$ref, ParameterObjectCodec))
				: option.some(param);

			const schema = pipe(
				parameter,
				option.chain(parameter => parameter.schema),
				either.fromOption(() => new Error(`Parameter ${key} must have a schema`)),
				either.chain(schema => serializeSchemaObject(from, schema)),
			);
			return pipe(
				schema,
				either.map(schema =>
					serializedPathParameter(key, schema.type, schema.io, true, schema.dependencies, schema.refs),
				),
			);
		}),
	),
);

export const serializeChannelItemObject = combineReader(
	serializeChannelPathParameters,
	serializeChannelPathParameters => (
		from: Ref,
		channel: string,
		channelItemObject: ChannelItemObject,
		kind: Kind,
	): Either<Error, SerializedType> => {
		const send = pipe(
			channelItemObject.subscribe,
			option.map(operation => serializeSubscribeOperationObject(from, channel, operation, kind)),
		);
		const message = pipe(
			channelItemObject.publish,
			option.map(operation => serializePublishOperationObject(from, channel, operation)),
		);
		const serialized = pipe(
			array.compact([send, message]),
			sequenceEither,
			either.map(serialized => intercalateSerializedTypes(serializedType(';', ',', [], []), serialized)),
		);
		const ws = pipe(
			channelItemObject.bindings,
			option.chain(bindings => bindings.ws),
		);
		const method = pipe(
			ws,
			option.chain(ws => ws.method),
			option.getOrElse(() => 'GET'),
		);
		const query = pipe(
			ws,
			option.chain(ws => ws.query),
			option.map(query => {
				const required = isRequired(query);
				return pipe(
					validateSchemaObject(query),
					either.chain(query => serializeSchemaObject(from, query)),
					either.map(serialized => getSerializedPropertyType('query', required, serialized)),
					either.map(fromSerializedType(required)),
				);
			}),
		);
		const headers = pipe(
			ws,
			option.chain(ws => ws.headers),
			option.map(headers => {
				const required = isRequired(headers);
				return pipe(
					validateSchemaObject(headers),
					either.chain(headers => serializeSchemaObject(from, headers)),
					either.map(serialized => getSerializedPropertyType('headers', required, serialized)),
					either.map(fromSerializedType(required)),
				);
			}),
		);
		const bindingParameters = pipe(array.compact([query, headers]), sequenceEither);

		const channelParameters = pipe(
			channelItemObject.parameters,
			option.map(params => serializeChannelPathParameters(from, params)),
			option.getOrElse<Either<Error, SerializedPathParameter>[]>(() => []),
			sequenceEither,
		);

		return combineEither(
			serialized,
			clientRef,
			bindingParameters,
			channelParameters,
			(serialized, clientRef, bindingParameters, channelParameters) => {
				const serializedBindingParameters = intercalateSerializedParameters(
					serializedParameter(';', ',', false, [], []),
					bindingParameters,
				);
				const serializedPathParameters = intercalateSerializedParameters(
					serializedParameter(';', ',', false, [], []),
					channelParameters
						.map(param => getSerializedPropertyType(param.name, true, param))
						.map(fromSerializedType(true)),
				);
				const allSerializedParameters = intercalateSerializedParameters(
					serializedParameter(';', ',', false, [], []),
					[serializedBindingParameters, serializedPathParameters].filter(x => x.type.length),
				);

				const encodedChannelParameters = channelParameters.map(param => ({
					...getSerializedPathParameterType(param),
					io: `${param.io}.encode(parameters.${param.name})`,
				}));

				const hasBindingParameters = bindingParameters.length > 0;
				const hasChannelParameters = channelParameters.length > 0;
				const hasParameters = hasBindingParameters || hasChannelParameters;
				const channelType = foldKind(kind, 'WebSocketClient', 'WebSocketClient1', 'WebSocketClient2');

				const type = `(${when(hasParameters, `parameters: { ${allSerializedParameters.type} }`)}) => { ${
					serialized.type
				} }`;
				const io = `(${when(hasParameters, 'parameters')}) => {
			${when(hasBindingParameters, `const encoded = partial({ ${serializedBindingParameters.io} }).encode(parameters);`)}
			const channel = e.webSocketClient.channel({
				channel: ${getURL(channel, encodedChannelParameters)},
				method: '${method}',
				${when(hasBindingParameters, '...encoded,')}
			})

			return { ${serialized.io} };
		}`;

				const dependencies = concatIf(
					hasParameters,
					[
						...serialized.dependencies,
						...allSerializedParameters.dependencies,
						serializedDependency(channelType, getRelativePath(from, clientRef)),
					],
					[serializedDependency('partial', 'io-ts')],
				);
				const refs = [...serialized.refs, ...allSerializedParameters.refs];
				return pipe(
					serializedType(type, io, dependencies, refs),
					getSerializedOptionPropertyType(channel, true),
				);
			},
		);
	},
);

const validateSchemaObject = (schemaObject: ObjectSchemaObject): Either<Error, ObjectSchemaObject> =>
	isSome(schemaObject.properties)
		? right(schemaObject)
		: left(new Error(`ChannelItemObject.query and ChannelItemObject.header should have "properties" field`));

const isRequired = (objectSchemaObject: ObjectSchemaObject): boolean =>
	pipe(
		sequenceTOption(objectSchemaObject.properties, objectSchemaObject.required),
		option.map(([properties, required]) => record.keys(properties).some(key => required.has(key))),
		option.getOrElse(constFalse),
	);
