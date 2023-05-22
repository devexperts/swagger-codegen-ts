"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("../../../../utils/fs");
const Record_1 = require("fp-ts/lib/Record");
const pipeable_1 = require("fp-ts/lib/pipeable");
const path_item_object_1 = require("./path-item-object");
const types_1 = require("../../../../utils/types");
const serialized_type_1 = require("../../common/data/serialized-type");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const string_1 = require("@devexperts/utils/dist/string/string");
const Either_1 = require("fp-ts/lib/Either");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const fp_ts_1 = require("fp-ts");
const ref_1 = require("../../../../utils/ref");
const either_utils_2 = require("@devexperts/utils/dist/adt/either.utils");
const function_1 = require("../../../../utils/function");
const client_1 = require("../../common/bundled/client");
const utils_1 = require("../../common/utils");
const response_maps_1 = require("./response-maps");
const serializeGrouppedPaths = reader_utils_1.combineReader(path_item_object_1.serializePathItemObject, response_maps_1.serializeResponseMaps, (serializePathItemObject, serializeResponseMaps) => (from) => (groupped) => {
    const serializedHKT = pipeable_1.pipe(types_1.serializeDictionary(groupped, (pattern, item) => serializePathItemObject(pattern, item, from, 'HKT')), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized_type_1.foldSerializedTypes));
    const serializedKind = pipeable_1.pipe(types_1.serializeDictionary(groupped, (pattern, item) => serializePathItemObject(pattern, item, from, '*')), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized_type_1.foldSerializedTypes));
    const serializedKind2 = pipeable_1.pipe(types_1.serializeDictionary(groupped, (pattern, item) => serializePathItemObject(pattern, item, from, '* -> *')), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized_type_1.foldSerializedTypes));
    const serializedResponseMaps = pipeable_1.pipe(types_1.serializeDictionary(groupped, (pattern, item) => serializeResponseMaps(pattern, item, from)), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized_type_1.foldSerializedTypes));
    return either_utils_2.combineEither(serializedHKT, serializedKind, serializedKind2, client_1.clientRef, serializedResponseMaps, (serializedHKT, serializedKind, serializedKind2, clientRef, serializedMaps) => {
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

						${serializedMaps.type}

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
exports.serializePathsObject = reader_utils_1.combineReader(serializeGrouppedPaths, serializeGrouppedPaths => (from) => (pathsObject) => {
    const groupped = groupPathsByTag(pathsObject);
    const files = pipeable_1.pipe(groupped, Record_1.collect((name, groupped) => pipeable_1.pipe(from, ref_1.addPathParts(name), fp_ts_1.either.map(serializeGrouppedPaths), fp_ts_1.either.chain(function_1.applyTo(groupped)))), either_utils_1.sequenceEither);
    const index = pipeable_1.pipe(from, ref_1.addPathParts('paths'), fp_ts_1.either.chain(from => serializePathsIndex(from, fp_ts_1.record.keys(groupped))));
    return either_utils_2.combineEither(files, index, (files, index) => fs_1.directory('paths', [...files, index]));
});
const groupPathsByTag = (pathsObject) => {
    const keys = Object.keys(pathsObject);
    const result = {};
    for (const key of keys) {
        const path = pathsObject[key];
        const tag = pipeable_1.pipe(path_item_object_1.serializePathItemObjectTags(path), fp_ts_1.option.map(p => utils_1.getControllerName(string_1.camelize(p, false))), fp_ts_1.option.getOrElse(() => utils_1.getControllerName('Unknown')));
        result[tag] = Object.assign(Object.assign({}, (result[tag] || {})), { [key]: path });
    }
    return result;
};
const serializePathsIndex = (from, pathNames) => {
    if (Either_1.isLeft(client_1.clientRef)) {
        return client_1.clientRef;
    }
    const pathToClient = ref_1.getRelativePath(from, client_1.clientRef.right);
    const dependencies = serialized_dependency_1.serializeDependencies([
        ...fp_ts_1.array.flatten(pathNames.map(name => {
            const p = `./${name}`;
            return [
                serialized_dependency_1.serializedDependency(string_1.decapitalize(name), p),
                serialized_dependency_1.serializedDependency(name, p),
                serialized_dependency_1.serializedDependency(`${name}1`, p),
                serialized_dependency_1.serializedDependency(`${name}2`, p),
            ];
        })),
        serialized_dependency_1.serializedDependency('URIS', 'fp-ts/lib/HKT'),
        serialized_dependency_1.serializedDependency('URIS2', 'fp-ts/lib/HKT'),
        serialized_dependency_1.serializedDependency('URIS2', 'fp-ts/lib/HKT'),
        serialized_dependency_1.serializedDependency('HTTPClient', pathToClient),
        serialized_dependency_1.serializedDependency('HTTPClient1', pathToClient),
        serialized_dependency_1.serializedDependency('HTTPClient2', pathToClient),
    ]);
    const content = `
		export interface Controllers<F> {
			${pathNames.map(name => `${string_1.decapitalize(name)}: ${name}<F>;`).join('\n')}
		}
		export interface Controllers1<F extends URIS> {
			${pathNames.map(name => `${string_1.decapitalize(name)}: ${name}1<F>;`).join('\n')}
		}
		export interface Controllers2<F extends URIS2> {
			${pathNames.map(name => `${string_1.decapitalize(name)}: ${name}2<F>;`).join('\n')}
		}

		export function controllers<F extends URIS2>(e: { httpClient: HTTPClient2<F> }): Controllers2<F>
		export function controllers<F extends URIS>(e: { httpClient: HTTPClient1<F> }): Controllers1<F>
		export function controllers<F>(e: { httpClient: HTTPClient<F> }): Controllers<F>;
		export function controllers<F>(e: { httpClient: HTTPClient<F> }): Controllers<F> {
			return {
				${pathNames.map(name => `${string_1.decapitalize(name)}: ${string_1.decapitalize(name)}(e),`).join('\n')}
			}
		}
	`;
    return Either_1.right(fs_1.file(`${from.name}.ts`, `
				${dependencies}

				${content}
			`));
};
