"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_1 = require("../../../../utils/ref");
const operation_object_1 = require("../../../../schema/asyncapi-2.0.0/operation-object");
const serialized_type_1 = require("../../common/data/serialized-type");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const either_1 = require("../../../../utils/either");
const reference_object_1 = require("../../../../schema/asyncapi-2.0.0/reference-object");
const message_object_1 = require("./message-object");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const client_1 = require("../../common/bundled/client");
const utils_1 = require("../../common/utils");
exports.serializePublishOperationObject = (from, channel, operationObject) => pipeable_1.pipe(serializeMessage(from, operationObject.message), fp_ts_1.either.map(serialized => {
    const type = `send: (payload: ${serialized.type}) => void`;
    const io = `send: payload => {
				channel.send(${serialized.io}.encode(payload));
			}`;
    return serialized_type_1.serializedType(type, io, serialized.dependencies, serialized.refs);
}));
exports.serializeSubscribeOperationObject = (from, channel, operationObject, kind) => {
    const serialized = serializeMessage(from, operationObject.message);
    return either_utils_1.combineEither(serialized, client_1.clientRef, (serialized, clientRef) => {
        const type = `message: ${utils_1.getKindValue(kind, serialized.type)}`;
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
            serialized_dependency_1.serializedDependency('pipe', 'fp-ts/lib/pipeable'),
            serialized_dependency_1.serializedDependency('mapLeft', 'fp-ts/lib/Either'),
            serialized_dependency_1.serializedDependency('fold', 'fp-ts/lib/Either'),
            serialized_dependency_1.serializedDependency('ResponseValidationError', ref_1.getRelativePath(from, clientRef)),
            serialized_dependency_1.getSerializedKindDependency(kind),
        ];
        return serialized_type_1.serializedType(type, io, dependencies, serialized.refs);
    });
};
const serializeMessage = (from, message) => operation_object_1.OperationObjectOneOfMessageCodec.is(message)
    ? pipeable_1.pipe(either_1.traverseNEAEither(message.oneOf, message => serializeSingleMessage(from, message)), fp_ts_1.either.map(serialized_type_1.getSerializedUnionType))
    : serializeSingleMessage(from, message);
const serializeSingleMessage = (from, message) => reference_object_1.ReferenceObjectCodec.is(message) ? serializeMessageReference(from, message) : message_object_1.serializeMessageObject(from, message);
const serializeMessageReference = (from, reference) => pipeable_1.pipe(ref_1.fromString(reference.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)));
