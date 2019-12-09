import { fromString, getRelativePath, Ref } from '../../../../utils/ref';
import {
	OperationObject,
	OperationObjectOneOfMessage,
	OperationObjectOneOfMessageCodec,
} from '../../../../schema/asyncapi-2.0.0/operation-object';
import { Either } from 'fp-ts/lib/Either';
import {
	getSerializedRefType,
	getSerializedUnionType,
	serializedType,
	SerializedType,
} from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { MessageObject } from '../../../../schema/asyncapi-2.0.0/message-object';
import { traverseNEAEither } from '../../../../utils/either';
import { ReferenceObject, ReferenceObjectCodec } from '../../../../schema/asyncapi-2.0.0/reference-object';
import { serializeMessageObject } from './message-object';
import { getSerializedKindDependency, serializedDependency } from '../../common/data/serialized-dependency';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { clientRef } from '../../common/bundled/client';
import { Kind } from '../../../../utils/types';
import { getKindValue } from '../../common/utils';

export const serializePublishOperationObject = (
	from: Ref,
	channel: string,
	operationObject: OperationObject,
): Either<Error, SerializedType> =>
	pipe(
		serializeMessage(from, operationObject.message),
		either.map(serialized => {
			const type = `send: (payload: ${serialized.type}) => void`;
			const io = `send: payload => {
				channel.send(${serialized.io}.encode(payload));
			}`;
			return serializedType(type, io, serialized.dependencies, serialized.refs);
		}),
	);
export const serializeSubscribeOperationObject = (
	from: Ref,
	channel: string,
	operationObject: OperationObject,
	kind: Kind,
): Either<Error, SerializedType> => {
	const serialized = serializeMessage(from, operationObject.message);
	return combineEither(serialized, clientRef, (serialized, clientRef) => {
		const type = `message: ${getKindValue(kind, serialized.type)}`;
		const io = `
			message: 
				channel.chain(channel.message, message =>
					pipe(
						${serialized.io}.decode(message),
						mapLeft(ResponseValidationError.create),
						fold(error => channel.throwError(error), value => channel.of(value)),
					),
				)
		`;
		const dependencies = [
			...serialized.dependencies,
			serializedDependency('pipe', 'fp-ts/lib/pipeable'),
			serializedDependency('mapLeft', 'fp-ts/lib/Either'),
			serializedDependency('fold', 'fp-ts/lib/Either'),
			serializedDependency('ResponseValidationError', getRelativePath(from, clientRef)),
			getSerializedKindDependency(kind),
		];
		return serializedType(type, io, dependencies, serialized.refs);
	});
};

const serializeMessage = (
	from: Ref,
	message: ReferenceObject | MessageObject | OperationObjectOneOfMessage,
): Either<Error, SerializedType> =>
	OperationObjectOneOfMessageCodec.is(message)
		? pipe(
				traverseNEAEither(message.oneOf, message => serializeSingleMessage(from, message)),
				either.map(getSerializedUnionType),
		  )
		: serializeSingleMessage(from, message);

const serializeSingleMessage = (from: Ref, message: ReferenceObject | MessageObject): Either<Error, SerializedType> =>
	ReferenceObjectCodec.is(message) ? serializeMessageReference(from, message) : serializeMessageObject(from, message);

const serializeMessageReference = (from: Ref, reference: ReferenceObject): Either<Error, SerializedType> =>
	pipe(fromString(reference.$ref), either.map(getSerializedRefType(from)));
