"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("../../../../utils/fs");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const ref_1 = require("../../../../utils/ref");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const utils_1 = require("../../common/utils");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const parameter_object_1 = require("./parameter-object");
exports.serializeParametersDefinitionsObject = (from, parametersDefinitionsObject) => pipeable_1.pipe(parametersDefinitionsObject, fp_ts_1.record.collect((name, parameterObject) => pipeable_1.pipe(from, ref_1.addPathParts(name), fp_ts_1.either.chain(from => serializeParameter(from, parameterObject)))), either_utils_1.sequenceEither, fp_ts_1.either.map(content => fs_1.directory('parameters', content)));
const serializeParameter = (from, parameterObject) => pipeable_1.pipe(parameter_object_1.serializeParameterObject(from, parameterObject), fp_ts_1.either.map(serialized => {
    const dependencies = serialized_dependency_1.serializeDependencies(serialized.dependencies);
    return fs_1.file(`${from.name}.ts`, `
					${dependencies}
					
					export type ${utils_1.getTypeName(from.name)} = ${serialized.type};
					export const ${utils_1.getIOName(from.name)} = ${serialized.io};
				`);
}));
