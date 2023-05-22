"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Array_1 = require("fp-ts/lib/Array");
const array_1 = require("../../../../utils/array");
const serialized_type_1 = require("../../common/data/serialized-type");
const operation_object_1 = require("./operation-object");
const pipeable_1 = require("fp-ts/lib/pipeable");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const fp_ts_1 = require("fp-ts");
exports.serializePathItemObject = reader_utils_1.combineReader(operation_object_1.serializeOperationObject, serializeOperationObject => (pattern, item, from, kind) => {
    const get = pipeable_1.pipe(item.get, fp_ts_1.option.map(operation => serializeOperationObject(pattern, 'GET', from, kind, operation, item)));
    const post = pipeable_1.pipe(item.post, fp_ts_1.option.map(operation => serializeOperationObject(pattern, 'POST', from, kind, operation, item)));
    const put = pipeable_1.pipe(item.put, fp_ts_1.option.map(operation => serializeOperationObject(pattern, 'PUT', from, kind, operation, item)));
    const remove = pipeable_1.pipe(item.delete, fp_ts_1.option.map(operation => serializeOperationObject(pattern, 'DELETE', from, kind, operation, item)));
    const patch = pipeable_1.pipe(item.patch, fp_ts_1.option.map(operation => serializeOperationObject(pattern, 'PATCH', from, kind, operation, item)));
    const head = pipeable_1.pipe(item.head, fp_ts_1.option.map(operation => serializeOperationObject(pattern, 'HEAD', from, kind, operation, item)));
    const options = pipeable_1.pipe(item.options, fp_ts_1.option.map(operation => serializeOperationObject(pattern, 'OPTIONS', from, kind, operation, item)));
    return pipeable_1.pipe(fp_ts_1.array.compact([get, post, put, remove, patch, head, options]), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized_type_1.foldSerializedTypes));
});
exports.serializePathItemObjectTags = (pathItemObject) => {
    const operations = [
        pathItemObject.get,
        pathItemObject.post,
        pathItemObject.put,
        pathItemObject.delete,
        pathItemObject.options,
        pathItemObject.head,
        pathItemObject.patch,
        pathItemObject.trace,
    ];
    return pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(fp_ts_1.array.compact(operations)), fp_ts_1.option.map(operations => array_1.uniqString(Array_1.flatten(fp_ts_1.array.compact(operations.map(operation => operation.tags))))), fp_ts_1.option.chain(fp_ts_1.nonEmptyArray.fromArray), fp_ts_1.option.map(tags => tags.join('').replace(/\s/g, '')));
};
