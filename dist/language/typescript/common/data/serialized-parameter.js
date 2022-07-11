"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_dependency_1 = require("./serialized-dependency");
const Monoid_1 = require("fp-ts/lib/Monoid");
const Foldable_1 = require("fp-ts/lib/Foldable");
const Array_1 = require("fp-ts/lib/Array");
const ref_1 = require("../../../../utils/ref");
exports.serializedParameter = (type, io, isRequired, dependencies, refs) => ({
    type,
    io,
    isRequired,
    dependencies: serialized_dependency_1.uniqSerializedDependencies(dependencies),
    refs: ref_1.uniqRefs(refs),
});
exports.fromSerializedType = (isRequired) => (serializedType) => (Object.assign(Object.assign({}, serializedType), { isRequired }));
exports.monoidSerializedParameter = Monoid_1.getStructMonoid({
    type: Monoid_1.monoidString,
    io: Monoid_1.monoidString,
    dependencies: serialized_dependency_1.monoidDependencies,
    isRequired: Monoid_1.monoidAny,
    refs: Array_1.getMonoid(),
});
exports.intercalateSerializedParameters = Foldable_1.intercalate(exports.monoidSerializedParameter, Array_1.array);
