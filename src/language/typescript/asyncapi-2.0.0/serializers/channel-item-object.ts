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
import { isSome } from 'fp-ts/lib/Option';
import { sequenceTOption } from '@devexperts/utils/dist/adt/option.utils';
import { constFalse } from 'fp-ts/lib/function';
import { when } from '../../../../utils/string';
import {
	fromSerializedType,
	intercalateSerializedParameters,
	serializedParameter,
} from '../../common/data/serialized-parameter';
import { concatIf } from '../../../../utils/array';

export const serializeChannelItemObject = (
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
	const parameters = pipe(
		array.compact([query, headers]),
		sequenceEither,
	);
	return combineEither(serialized, clientRef, parameters, (serialized, clientRef, parameters) => {
		const serializedParameters = intercalateSerializedParameters(
			serializedParameter(';', ',', false, [], []),
			parameters,
		);

		const hasParameters = parameters.length > 0;
		const channelType = foldKind(kind, 'WebSocketClient', 'WebSocketClient1', 'WebSocketClient2');

		const type = `(${when(hasParameters, `parameters: { ${serializedParameters.type} }`)}) => { ${
			serialized.type
		} }`;
		const io = `(${when(hasParameters, 'parameters')}) => {
			${when(hasParameters, `const encoded = partial({ ${serializedParameters.io} }).encode(parameters);`)}
			const channel = e.webSocketClient.channel({
				channel: ${JSON.stringify(channel)},
				method: '${method}',
				${when(hasParameters, '...encoded,')}
			})
			return { ${serialized.io} };
		}`;
		const dependencies = concatIf(
			hasParameters,
			[
				...serialized.dependencies,
				...serializedParameters.dependencies,
				serializedDependency(channelType, getRelativePath(from, clientRef)),
			],
			[serializedDependency('partial', 'io-ts')],
		);
		const refs = [...serialized.refs, ...serializedParameters.refs];
		return pipe(
			serializedType(type, io, dependencies, refs),
			getSerializedOptionPropertyType(`[${JSON.stringify(channel)}]`, true),
		);
	});
};

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
