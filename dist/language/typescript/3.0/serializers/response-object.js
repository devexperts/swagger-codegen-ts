"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_type_1 = require("../../common/data/serialized-type");
const pipeable_1 = require("fp-ts/lib/pipeable");
const schema_object_1 = require("./schema-object");
const ref_1 = require("../../../../utils/ref");
const fp_ts_1 = require("fp-ts");
const reference_object_1 = require("../../../../schema/3.0/reference-object");
const utils_1 = require("../../common/utils");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const requestMediaRegexp = /^(video|audio|image|application|text|\*)\/(\w+|\*)/;
const serializeResponseSchema = reader_utils_1.combineReader(schema_object_1.serializeSchemaObject, serializeSchemaObject => (responseType, schema, from) => {
    switch (responseType) {
        case 'json':
            return reference_object_1.ReferenceObjectCodec.is(schema)
                ? pipeable_1.pipe(ref_1.fromString(schema.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)))
                : serializeSchemaObject(from)(schema);
        case 'text':
            return fp_ts_1.either.right(serialized_type_1.SERIALIZED_STRING_TYPE);
        case 'blob':
            return serialized_type_1.getSerializedBlobType(from);
    }
});
exports.serializeResponseObject = reader_utils_1.combineReader(schema_object_1.serializeSchemaObject, serializeResponseSchema, (serializeSchemaObject, serializeResponseSchema) => (from, responseObject) => pipeable_1.pipe(responseObject.content, fp_ts_1.option.chain(content => utils_1.getKeyMatchValue(content, requestMediaRegexp)), fp_ts_1.option.chain(({ key: mediaType, value: { schema } }) => pipeable_1.pipe(schema, fp_ts_1.option.map(schema => ({ mediaType, schema })))), fp_ts_1.option.map(({ mediaType, schema }) => {
    const resType = utils_1.getResponseTypeFromMediaType(mediaType);
    return serializeResponseSchema(resType, schema, from);
})));
exports.serializeResponseObjectWithMediaType = reader_utils_1.combineReader(serializeResponseSchema, serializeResponseSchema => (from, responseObject) => pipeable_1.pipe(responseObject.content, fp_ts_1.option.chain(content => utils_1.getKeyMatchValues(content, requestMediaRegexp)), fp_ts_1.option.chain(arr => pipeable_1.pipe(arr, fp_ts_1.array.map(({ key: mediaType, value: { schema } }) => pipeable_1.pipe(schema, fp_ts_1.option.map(schema => ({ mediaType, schema })))), fp_ts_1.array.filterMap(a => a), fp_ts_1.nonEmptyArray.fromArray)), fp_ts_1.option.map(arr => pipeable_1.pipe(arr, fp_ts_1.array.map(({ mediaType, schema }) => {
    const resType = utils_1.getResponseTypeFromMediaType(mediaType);
    return pipeable_1.pipe(serializeResponseSchema(resType, schema, from), fp_ts_1.either.map(schema => ({
        mediaType,
        schema,
    })));
}), either_utils_1.sequenceEither))));
