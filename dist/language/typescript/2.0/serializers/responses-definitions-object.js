"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../common/utils");
const ref_1 = require("../../../../utils/ref");
const fs_1 = require("../../../../utils/fs");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const response_object_1 = require("./response-object");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
exports.serializeResponsesDefinitionsObject = (from, responsesDefinitionsObject) => pipeable_1.pipe(responsesDefinitionsObject, fp_ts_1.record.collect((name, parameterObject) => pipeable_1.pipe(from, ref_1.addPathParts(name), fp_ts_1.either.chain(from => serializeResponse(from, parameterObject)))), either_utils_1.sequenceEither, fp_ts_1.either.map(content => fs_1.directory('responses', content)));
const serializeResponse = (from, responseObject) => pipeable_1.pipe(response_object_1.serializeResponseObject(from, responseObject), fp_ts_1.either.map(serialized => {
    const dependencies = serialized_dependency_1.serializeDependencies(serialized.dependencies);
    return fs_1.file(`${from.name}.ts`, `
					${dependencies}
					
					export type ${utils_1.getTypeName(from.name)} = ${serialized.type};
					export const ${utils_1.getIOName(from.name)} = ${serialized.io};
				`);
}));
