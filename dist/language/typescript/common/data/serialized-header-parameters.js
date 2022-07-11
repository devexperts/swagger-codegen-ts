"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_1 = require("../../../../utils/ref");
const utils_1 = require("../utils");
const serialized_dependency_1 = require("./serialized-dependency");
exports.serializedHeaderParameter = (name, type, io, isRequired, dependencies, refs) => ({
    name,
    type,
    io,
    isRequired,
    dependencies: serialized_dependency_1.uniqSerializedDependencies(dependencies),
    refs: ref_1.uniqRefs(refs),
});
exports.fromSerializedHeaderParameter = (name) => (serialized) => (Object.assign(Object.assign({}, serialized), { name }));
exports.getSerializedHeaderParameterType = (serialized) => {
    const name = utils_1.getTypeName(serialized.name);
    return exports.serializedHeaderParameter(name, `${name}: ${serialized.isRequired ? serialized.type : `option.Option<${serialized.type}>`}`, `${name}: ${serialized.isRequired ? serialized.io : `optionFromNullable(${serialized.io})`}`, serialized.isRequired, serialized.dependencies.concat(serialized.isRequired
        ? []
        : [
            serialized_dependency_1.serializedDependency('optionFromNullable', 'io-ts-types/lib/optionFromNullable'),
            serialized_dependency_1.serializedDependency('option', 'fp-ts'),
        ]), serialized.refs);
};
