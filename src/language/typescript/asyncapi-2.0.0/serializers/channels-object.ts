import { Either } from 'fp-ts/lib/Either';
import { file, FSEntity } from '../../../../utils/fs';
import { addPathParts, getRelativePath, Ref } from '../../../../utils/ref';
import { ChannelsObject } from '../../../../schema/asyncapi-2.0.0/channels-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, record } from 'fp-ts';
import { serializeChannelItemObject } from './channel-item-object';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { intercalateSerializedTypes, SerializedType, serializedType } from '../../common/data/serialized-type';
import { serializedDependency, serializeDependencies } from '../../common/data/serialized-dependency';
import { Kind } from '../../../../utils/types';
import { clientRef } from '../../common/client';

const serializeChannelsObjectWithKind = (
	from: Ref,
	channelsObject: ChannelsObject,
	kind: Kind,
): Either<Error, SerializedType> =>
	pipe(
		channelsObject,
		record.collect((channel, channelItemObject) =>
			pipe(
				from,
				addPathParts('channels'),
				either.chain(from => serializeChannelItemObject(from, channel, channelItemObject, kind)),
			),
		),
		sequenceEither,
		either.map(serialized => intercalateSerializedTypes(serializedType(';', ',', [], []), serialized)),
	);

export const serializeChannelsObject = (from: Ref, channelsObject: ChannelsObject): Either<Error, FSEntity> => {
	const ref = pipe(
		from,
		addPathParts('channels'),
	);
	const serializedHKT = serializeChannelsObjectWithKind(from, channelsObject, 'HKT');
	const serializedKind = serializeChannelsObjectWithKind(from, channelsObject, '*');
	const serializedKind2 = serializeChannelsObjectWithKind(from, channelsObject, '* -> *');

	return combineEither(
		ref,
		serializedHKT,
		serializedKind,
		serializedKind2,
		clientRef,
		(ref, serializedHKT, serializedKind, serializedKind2, clientRef) => {
			const clientPath = getRelativePath(ref, clientRef);
			const dependencies = serializeDependencies([
				...serializedHKT.dependencies,
				...serializedKind.dependencies,
				...serializedKind2.dependencies,
				serializedDependency('URIS', 'fp-ts/lib/HKT'),
				serializedDependency('URIS2', 'fp-ts/lib/HKT'),
				serializedDependency('WebSocketClient', clientPath),
				serializedDependency('WebSocketClient1', clientPath),
				serializedDependency('WebSocketClient2', clientPath),
			]);

			return file(
				`${ref.name}.ts`,
				`
					${dependencies}
					
					export interface Channels2<F extends URIS2> { 
						${serializedKind2.type}
					}
					export interface Channels1<F extends URIS> { 
						${serializedKind.type}
					}
					export interface Channels<F> { 
						${serializedHKT.type}
					}
					
					export function channels<F extends URIS2>(e: { webSocketClient: WebSocketClient2<F> }): Channels2<F>;
					export function channels<F extends URIS>(e: { webSocketClient: WebSocketClient1<F> }): Channels1<F>;
					export function channels<F>(e: { webSocketClient: WebSocketClient<F> }): Channels<F>;
					export function channels<F>(e: { webSocketClient: WebSocketClient<F> }): Channels<F> {
						return {
							${serializedHKT.io}
						};
					};
				`,
			);
		},
	);
};
