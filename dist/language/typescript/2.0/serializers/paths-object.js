"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("../../../../utils/fs");
const path_item_object_1 = require("./path-item-object");
const utils_1 = require("../../common/utils");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const Either_1 = require("fp-ts/lib/Either");
const ref_1 = require("../../../../utils/ref");
const string_1 = require("@devexperts/utils/dist/string/string");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const client_1 = require("../../common/bundled/client");
exports.serializePaths = reader_utils_1.combineReader(path_item_object_1.serializePathGroup, serializePathGroup => (from, paths) => {
    const groupped = groupPathsByTag(paths);
    const files = pipeable_1.pipe(groupped, fp_ts_1.record.collect((name, group) => pipeable_1.pipe(from, ref_1.addPathParts(name), fp_ts_1.either.chain(from => serializePathGroup(from, name, group)))), either_utils_1.sequenceEither);
    const index = pipeable_1.pipe(from, ref_1.addPathParts(utils_1.CONTROLLERS_DIRECTORY), fp_ts_1.either.chain(from => serializePathsIndex(from, fp_ts_1.record.keys(groupped))));
    return either_utils_1.combineEither(files, index, (files, index) => fs_1.directory(utils_1.CONTROLLERS_DIRECTORY, [...files, index]));
});
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
