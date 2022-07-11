"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_type_1 = require("../../common/data/serialized-type");
const utils_1 = require("../../common/utils");
const pipeable_1 = require("fp-ts/lib/pipeable");
const response_object_1 = require("./response-object");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const fp_ts_1 = require("fp-ts");
const ref_1 = require("../../../../utils/ref");
const function_1 = require("fp-ts/lib/function");
const reference_object_1 = require("../../../../schema/3.0/reference-object");
const Option_1 = require("fp-ts/lib/Option");
const Eq_1 = require("fp-ts/lib/Eq");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const concatNonUniqResonses = (responses) => pipeable_1.pipe(responses, fp_ts_1.array.map(({ mediaType }) => mediaType), fp_ts_1.array.uniq(Eq_1.eqString), fp_ts_1.array.map(mediaType => {
    const schemes = pipeable_1.pipe(responses, fp_ts_1.array.filter(a => a.mediaType === mediaType), fp_ts_1.array.map(a => a.schema), serialized_type_1.uniqSerializedTypesByTypeAndIO);
    if (schemes.length > 1) {
        const combined = serialized_type_1.intercalateSerializedTypes(serialized_type_1.serializedType('|', ',', [], []), schemes);
        const scheme = serialized_type_1.serializedType(combined.type, `union([${combined.io}])`, combined.dependencies.concat([serialized_dependency_1.serializedDependency('union', 'io-ts')]), []);
        return { mediaType, schema: scheme };
    }
    return { mediaType, schema: schemes[0] };
}));
exports.serializeResponsesObject = reader_utils_1.combineReader(response_object_1.serializeResponseObjectWithMediaType, serializeResponseObjectWithMediaType => (from) => (responsesObject) => {
    const serializedResponses = pipeable_1.pipe(utils_1.SUCCESSFUL_CODES, fp_ts_1.array.map(code => pipeable_1.pipe(fp_ts_1.record.lookup(code, responsesObject), fp_ts_1.option.chain(r => reference_object_1.ReferenceObjectCodec.is(r)
        ? pipeable_1.pipe(ref_1.fromString(r.$ref), fp_ts_1.either.mapLeft(() => new Error(`Invalid ${r.$ref} for ResponsesObject'c code "${code}"`)), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)), fp_ts_1.either.map(type => [{ mediaType: utils_1.DEFAULT_MEDIA_TYPE, schema: type }]), Option_1.some)
        : serializeResponseObjectWithMediaType(from, r)))), fp_ts_1.array.compact, either_utils_1.sequenceEither, fp_ts_1.either.map(function_1.flow(fp_ts_1.array.flatten, concatNonUniqResonses)));
    return pipeable_1.pipe(serializedResponses, fp_ts_1.either.map(serializedResponses => {
        if (serializedResponses.length === 0) {
            return fp_ts_1.either.left({ mediaType: utils_1.DEFAULT_MEDIA_TYPE, schema: serialized_type_1.SERIALIZED_VOID_TYPE });
        }
        else if (serializedResponses.length === 1) {
            return fp_ts_1.either.left(serializedResponses[0]);
        }
        else {
            return fp_ts_1.either.right(serializedResponses);
        }
    }));
});
