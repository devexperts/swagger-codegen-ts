"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("../../../../utils/fs");
const ref_1 = require("../../../../utils/ref");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const channel_item_object_1 = require("./channel-item-object");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const serialized_type_1 = require("../../common/data/serialized-type");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const client_1 = require("../../common/bundled/client");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const serializeChannelsObjectWithKind = reader_utils_1.combineReader(channel_item_object_1.serializeChannelItemObject, serializeChannelItemObject => (from, channelsObject, kind) => pipeable_1.pipe(channelsObject, fp_ts_1.record.collect((channel, channelItemObject) => pipeable_1.pipe(from, ref_1.addPathParts('channels'), fp_ts_1.either.chain(from => serializeChannelItemObject(from, channel, channelItemObject, kind)))), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized => serialized_type_1.intercalateSerializedTypes(serialized_type_1.serializedType(';', ',', [], []), serialized))));
exports.serializeChannelsObject = reader_utils_1.combineReader(serializeChannelsObjectWithKind, serializeChannelsObjectWithKind => (from, channelsObject) => {
    const ref = pipeable_1.pipe(from, ref_1.addPathParts('channels'));
    const serializedHKT = serializeChannelsObjectWithKind(from, channelsObject, 'HKT');
    const serializedKind = serializeChannelsObjectWithKind(from, channelsObject, '*');
    const serializedKind2 = serializeChannelsObjectWithKind(from, channelsObject, '* -> *');
    return either_utils_1.combineEither(ref, serializedHKT, serializedKind, serializedKind2, client_1.clientRef, (ref, serializedHKT, serializedKind, serializedKind2, clientRef) => {
        const clientPath = ref_1.getRelativePath(ref, clientRef);
        const dependencies = serialized_dependency_1.serializeDependencies([
            ...serializedHKT.dependencies,
            ...serializedKind.dependencies,
            ...serializedKind2.dependencies,
            serialized_dependency_1.serializedDependency('URIS', 'fp-ts/lib/HKT'),
            serialized_dependency_1.serializedDependency('URIS2', 'fp-ts/lib/HKT'),
            serialized_dependency_1.serializedDependency('WebSocketClient', clientPath),
            serialized_dependency_1.serializedDependency('WebSocketClient1', clientPath),
            serialized_dependency_1.serializedDependency('WebSocketClient2', clientPath),
        ]);
        return fs_1.file(`${ref.name}.ts`, `
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
				`);
    });
});
