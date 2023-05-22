"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_object_1 = require("./schema-object");
const serialized_type_1 = require("../../common/data/serialized-type");
const Either_1 = require("fp-ts/lib/Either");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const ref_1 = require("../../../../utils/ref");
const reference_object_1 = require("../../../../schema/3.0/reference-object");
const utils_1 = require("../../common/utils");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const requestMediaRegexp = /^(video|audio|image|application|text|multipart|\*)\/(\w+|\*)/;
exports.getRequestMedia = (content) => utils_1.getKeyMatchValue(content, requestMediaRegexp);
exports.serializeRequestBodyObject = reader_utils_1.combineReader(schema_object_1.serializeSchemaObject, serializeSchemaObject => {
    const serializeRequestBodyObject = (from, body) => pipeable_1.pipe(exports.getRequestMedia(body.content), fp_ts_1.option.chain(({ key: mediaType, value: { schema } }) => pipeable_1.pipe(schema, fp_ts_1.option.map(schema => ({ mediaType, schema })))), fp_ts_1.either.fromOption(() => new Error('No schema found for RequestBodyObject')), fp_ts_1.either.chain(({ mediaType, schema }) => {
        const resType = utils_1.getResponseTypeFromMediaType(mediaType);
        return serializeRequestSchema(resType, schema, from);
    }));
    const serializeRequestSchema = (responseType, schema, from) => {
        switch (responseType) {
            case 'json':
                return reference_object_1.ReferenceObjectCodec.is(schema)
                    ? pipeable_1.pipe(ref_1.fromString(schema.$ref), Either_1.mapLeft(() => new Error(`Invalid MediaObject.content.$ref "${schema.$ref}" for RequestBodyObject`)), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)))
                    : serializeSchemaObject(from)(schema);
            case 'text':
                return fp_ts_1.either.right(serialized_type_1.SERIALIZED_STRING_TYPE);
            case 'blob':
                return serialized_type_1.getSerializedBlobType(from);
        }
    };
    return serializeRequestBodyObject;
});
