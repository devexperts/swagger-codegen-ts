"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("../../../../utils/fs");
const schema_object_1 = require("./schema-object");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const utils_1 = require("../../common/utils");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const ref_1 = require("../../../../utils/ref");
exports.serializeDefinitions = (from, definitions) => pipeable_1.pipe(definitions, fp_ts_1.record.collect((name, definition) => pipeable_1.pipe(from, ref_1.addPathParts(name), fp_ts_1.either.chain(from => serializeDefinition(from, name, definition)))), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized => fs_1.directory(utils_1.DEFINITIONS_DIRECTORY, serialized)));
const serializeDefinition = (from, name, definition) => pipeable_1.pipe(schema_object_1.serializeSchemaObject(from, definition), fp_ts_1.either.map(serialized => {
    const dependencies = serialized_dependency_1.serializeDependencies(serialized.dependencies);
    return fs_1.file(`${name}.ts`, `
					${dependencies}
					
					export type ${name} = ${serialized.type};
					export const ${utils_1.getIOName(name)} = ${serialized.io};
				`);
}));
