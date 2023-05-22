"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_item_object_1 = require("../../../../schema/2.0/path-item-object");
const serialized_type_1 = require("../../common/data/serialized-type");
const pipeable_1 = require("fp-ts/lib/pipeable");
const Option_1 = require("fp-ts/lib/Option");
const operation_object_1 = require("./operation-object");
const Array_1 = require("fp-ts/lib/Array");
const fs_1 = require("../../../../utils/fs");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const string_1 = require("@devexperts/utils/dist/string/string");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const fp_ts_1 = require("fp-ts");
const ref_1 = require("../../../../utils/ref");
const client_1 = require("../../common/bundled/client");
const function_1 = require("fp-ts/lib/function");
const array_1 = require("../../../../utils/array");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const Reader_1 = require("fp-ts/lib/Reader");
const serializePath = reader_utils_1.combineReader(Reader_1.ask(), operation_object_1.serializeOperationObject, (e, serializeOperationObject) => {
    const run = (from, url, kind, item) => {
        if (Option_1.isSome(item.$ref)) {
            const $ref = item.$ref.value;
            return pipeable_1.pipe(e.resolveRef($ref, path_item_object_1.PathItemObjectCodec), fp_ts_1.either.mapLeft(() => new Error(`Unable to resolve PathItem $ref: "${$ref}"`)), fp_ts_1.either.chain(resolved => run(from, url, kind, resolved)));
        }
        else {
            const get = pipeable_1.pipe(item.get, Option_1.map(operation => serializeOperationObject(from, url, 'GET', kind, operation, item)));
            const put = pipeable_1.pipe(item.put, Option_1.map(operation => serializeOperationObject(from, url, 'PUT', kind, operation, item)));
            const post = pipeable_1.pipe(item.post, Option_1.map(operation => serializeOperationObject(from, url, 'POST', kind, operation, item)));
            const remove = pipeable_1.pipe(item.delete, Option_1.map(operation => serializeOperationObject(from, url, 'DELETE', kind, operation, item)));
            const options = pipeable_1.pipe(item.options, Option_1.map(operation => serializeOperationObject(from, url, 'OPTIONS', kind, operation, item)));
            const head = pipeable_1.pipe(item.head, Option_1.map(operation => serializeOperationObject(from, url, 'HEAD', kind, operation, item)));
            const patch = pipeable_1.pipe(item.patch, Option_1.map(operation => serializeOperationObject(from, url, 'PATCH', kind, operation, item)));
            const operations = [get, put, post, remove, options, head, patch];
            return pipeable_1.pipe(operations, Array_1.array.compact, either_utils_1.sequenceEither, fp_ts_1.either.map(serialized_type_1.foldSerializedTypes));
        }
    };
    return run;
});
exports.serializePathGroup = reader_utils_1.combineReader(serializePath, serializePath => (from, name, group) => {
    const serializedHKT = pipeable_1.pipe(group, fp_ts_1.record.collect((url, item) => serializePath(from, url, 'HKT', item)), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized_type_1.foldSerializedTypes));
    const serializedKind = pipeable_1.pipe(group, fp_ts_1.record.collect((url, item) => serializePath(from, url, '*', item)), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized_type_1.foldSerializedTypes));
    const serializedKind2 = pipeable_1.pipe(group, fp_ts_1.record.collect((url, item) => serializePath(from, url, '* -> *', item)), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized_type_1.foldSerializedTypes));
    return either_utils_1.combineEither(serializedHKT, serializedKind, serializedKind2, client_1.clientRef, (serializedHKT, serializedKind, serializedKind2, clientRef) => {
        const dependencies = serialized_dependency_1.serializeDependencies([
            ...serializedHKT.dependencies,
            ...serializedKind.dependencies,
            ...serializedKind2.dependencies,
            serialized_dependency_1.serializedDependency('HTTPClient', ref_1.getRelativePath(from, clientRef)),
            serialized_dependency_1.serializedDependency('HTTPClient1', ref_1.getRelativePath(from, clientRef)),
            serialized_dependency_1.serializedDependency('HTTPClient2', ref_1.getRelativePath(from, clientRef)),
            serialized_dependency_1.serializedDependency('URIS', 'fp-ts/lib/HKT'),
            serialized_dependency_1.serializedDependency('URIS2', 'fp-ts/lib/HKT'),
        ]);
        return fs_1.file(`${from.name}.ts`, `
					${dependencies}

					export interface ${from.name}<F> {
						${serializedHKT.type}
					}

					export interface ${from.name}1<F extends URIS> {
						${serializedKind.type}
					}

					export interface ${from.name}2<F extends URIS2> {
						${serializedKind2.type}
					}

					export function ${string_1.decapitalize(from.name)}<F extends URIS2>(e: { httpClient: HTTPClient2<F> }): ${from.name}2<F>
					export function ${string_1.decapitalize(from.name)}<F extends URIS>(e: { httpClient: HTTPClient1<F> }): ${from.name}1<F>
					export function ${string_1.decapitalize(from.name)}<F>(e: { httpClient: HTTPClient<F> }): ${from.name}<F>;
					export function ${string_1.decapitalize(from.name)}<F>(e: { httpClient: HTTPClient<F> }): ${from.name}<F> {
						return {
							${serializedHKT.io}
						}
					}
				`);
    });
});
const getOperationsFromPath = (path) => {
    const result = {};
    const operations = Array_1.array.compact([
        pipeable_1.pipe(path.get, Option_1.map(operation => function_1.tuple('get', operation))),
        pipeable_1.pipe(path.post, Option_1.map(operation => function_1.tuple('post', operation))),
        pipeable_1.pipe(path.put, Option_1.map(operation => function_1.tuple('put', operation))),
        pipeable_1.pipe(path.delete, Option_1.map(operation => function_1.tuple('delete', operation))),
        pipeable_1.pipe(path.head, Option_1.map(operation => function_1.tuple('head', operation))),
        pipeable_1.pipe(path.options, Option_1.map(operation => function_1.tuple('options', operation))),
        pipeable_1.pipe(path.patch, Option_1.map(operation => function_1.tuple('patch', operation))),
    ]);
    for (const [name, operation] of operations) {
        result[name] = operation;
    }
    return result;
};
exports.getTagsFromPath = (path) => {
    const operations = getOperationsFromPath(path);
    const tags = Array_1.flatten(Array_1.array.compact(Object.keys(operations).map(key => operations[key].tags)));
    return array_1.uniqString(tags);
};
exports.serializePathItemObjectTags = (pathItemObject) => {
    const operations = [
        pathItemObject.get,
        pathItemObject.post,
        pathItemObject.put,
        pathItemObject.delete,
        pathItemObject.options,
        pathItemObject.head,
        pathItemObject.patch,
    ];
    return pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(Array_1.array.compact(operations)), fp_ts_1.option.map(operations => array_1.uniqString(Array_1.flatten(Array_1.array.compact(operations.map(operation => operation.tags))))), fp_ts_1.option.chain(fp_ts_1.nonEmptyArray.fromArray), fp_ts_1.option.map(tags => tags.join('').replace(/\s/g, '')));
};
