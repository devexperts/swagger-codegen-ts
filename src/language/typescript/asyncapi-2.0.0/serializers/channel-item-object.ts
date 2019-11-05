import { Ref } from '../../../../utils/ref';
import { ChannelItemObject } from '../../../../schema/asyncapi-2.0.0/channel-item-object';
import { Either } from 'fp-ts/lib/Either';
import {
	getSerializedPropertyType,
	intercalateSerializedTypes,
	serializedType,
	SerializedType,
} from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, option } from 'fp-ts';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { serializePublishOperationObject, serializeSubscribeOperationObject } from './operation-object';
import { Kind } from '../../../../utils/types';

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
	return combineEither(serialized, serialized =>
		pipe(
			serializedType(`{ ${serialized.type} }`, `{ ${serialized.io} }`, serialized.dependencies, serialized.refs),
			getSerializedPropertyType(`[${JSON.stringify(channel)}]`, true),
		),
	);
};
