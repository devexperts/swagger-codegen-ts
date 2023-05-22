"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_dependency_1 = require("./serialized-dependency");
const ref_1 = require("../../../../utils/ref");
const utils_1 = require("../utils");
exports.serializedPathParameter = (name, type, io, isRequired, dependencies, refs) => ({
    name,
    type,
    io,
    isRequired,
    dependencies: serialized_dependency_1.uniqSerializedDependencies(dependencies),
    refs: ref_1.uniqRefs(refs),
});
exports.fromSerializedParameter = (name) => (serialized) => (Object.assign(Object.assign({}, serialized), { name }));
exports.getSerializedPathParameterType = (serialized) => {
    const name = utils_1.getTypeName(serialized.name);
    return exports.serializedPathParameter(name, `${name}: ${serialized.type}`, `${serialized.io}.encode(${name})`, serialized.isRequired, serialized.dependencies, serialized.refs);
};
