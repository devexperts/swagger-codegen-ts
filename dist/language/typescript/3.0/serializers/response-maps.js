"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_ts_1 = require("fp-ts");
const pipeable_1 = require("fp-ts/lib/pipeable");
const function_1 = require("fp-ts/lib/function");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const operation_object_1 = require("./operation-object");
const responses_object_1 = require("./responses-object");
const serialized_type_1 = require("../../common/data/serialized-type");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const serializeResponseMap = reader_utils_1.combineReader(responses_object_1.serializeResponsesObject, serializeResponsesObject => (pattern, method, from, operation) => {
    const operationName = operation_object_1.getOperationName(pattern, operation, method);
    const serializedResponses = serializeResponsesObject(from)(operation.responses);
    return pipeable_1.pipe(serializedResponses, fp_ts_1.either.map(function_1.flow(fp_ts_1.either.fold(() => serialized_type_1.serializedType('', '', [], []), sr => {
        const rows = sr.map(s => `'${s.mediaType}': ${s.schema.type};`);
        const type = `type MapToResponse${operationName} = {${rows.join('')}};`;
        return serialized_type_1.serializedType(type, '', [], []); // dependecies in serializeOperationObject serializedResponses
    }))));
});
exports.serializeResponseMaps = reader_utils_1.combineReader(serializeResponseMap, serializeResponseMap => (pattern, item, from) => {
    const methods = [
        ['GET', item.get],
        ['POST', item.post],
        ['PUT', item.put],
        ['DELETE', item.delete],
        ['PATCH', item.patch],
        ['HEAD', item.head],
        ['OPTIONS', item.options],
    ];
    return pipeable_1.pipe(methods, fp_ts_1.array.map(([method, opObject]) => pipeable_1.pipe(opObject, fp_ts_1.option.map(operation => serializeResponseMap(pattern, method, from, operation)))), fp_ts_1.array.compact, either_utils_1.sequenceEither, fp_ts_1.either.map(serialized_type_1.foldSerializedTypes));
});
