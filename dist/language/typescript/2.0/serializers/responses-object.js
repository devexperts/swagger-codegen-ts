"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_type_1 = require("../../common/data/serialized-type");
const pipeable_1 = require("fp-ts/lib/pipeable");
const response_object_1 = require("./response-object");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const array_1 = require("../../../../utils/array");
const fp_ts_1 = require("fp-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const ref_1 = require("../../../../utils/ref");
const reference_object_1 = require("../../../../schema/3.0/reference-object");
exports.serializeOperationResponses = (from, responses) => pipeable_1.pipe(responses, fp_ts_1.record.collect((code, response) => {
    if (reference_object_1.ReferenceObjectCodec.is(response)) {
        return pipeable_1.pipe(ref_1.fromString(response.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)));
    }
    else {
        return response_object_1.serializeResponseObject(from, response);
    }
}), either_utils_1.sequenceEither, fp_ts_1.either.map(responses => {
    const serializedResponses = serialized_type_1.uniqSerializedTypesByTypeAndIO(responses);
    if (serializedResponses.length === 0) {
        return serialized_type_1.SERIALIZED_VOID_TYPE;
    }
    const combined = serialized_type_1.intercalateSerializedTypes(serialized_type_1.serializedType('|', ',', [], []), serializedResponses);
    const isUnion = serializedResponses.length > 1;
    return serialized_type_1.serializedType(combined.type, isUnion ? `union([${combined.io}])` : combined.io, array_1.concatIfL(isUnion, combined.dependencies, () => [serialized_dependency_1.serializedDependency('union', 'io-ts')]), []);
}));
