"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_dependency_1 = require("./serialized-dependency");
const Monoid_1 = require("fp-ts/lib/Monoid");
const Array_1 = require("fp-ts/lib/Array");
const Foldable_1 = require("fp-ts/lib/Foldable");
const NonEmptyArray_1 = require("fp-ts/lib/NonEmptyArray");
const ref_1 = require("../../../../utils/ref");
const fp_ts_1 = require("fp-ts");
exports.serializedFragment = (value, dependencies, refs) => ({
    value,
    dependencies: serialized_dependency_1.uniqSerializedDependencies(dependencies),
    refs: ref_1.uniqRefs(refs),
});
exports.monoidSerializedFragment = Monoid_1.getStructMonoid({
    value: Monoid_1.monoidString,
    dependencies: Array_1.getMonoid(),
    refs: Array_1.getMonoid(),
});
exports.intercalateSerializedFragmentsNEA = Foldable_1.intercalate(exports.monoidSerializedFragment, NonEmptyArray_1.nonEmptyArray);
exports.intercalateSerializedFragments = Foldable_1.intercalate(exports.monoidSerializedFragment, fp_ts_1.array.array);
exports.foldSerializedFragments = Monoid_1.fold(exports.monoidSerializedFragment);
function combineFragments(...args) {
    const fragments = args.slice(0, -1);
    const project = args[args.length - 1];
    const fragment = project(...fragments.map(f => f.value));
    const dependencies = fp_ts_1.array.flatten(fragments.map(f => f.dependencies));
    const refs = fp_ts_1.array.flatten(fragments.map(f => f.refs));
    return exports.serializedFragment(fragment, dependencies, refs);
}
exports.combineFragments = combineFragments;
function combineFragmentsK(...args) {
    const fragments = args.slice(0, -1);
    const project = args[args.length - 1];
    const fragment = project(...fragments.map(f => f.value));
    const dependencies = fp_ts_1.array.flatten(fragments.map(f => f.dependencies));
    const refs = fp_ts_1.array.flatten(fragments.map(f => f.refs));
    return exports.serializedFragment(fragment.value, dependencies.concat(fragment.dependencies), refs.concat(fragment.refs));
}
exports.combineFragmentsK = combineFragmentsK;
/**
 * @param f returns an Option
 */
exports.getSerializedOptionCallFragment = (nullable, f, a) => combineFragmentsK(f, a, (fn, a) => nullable
    ? exports.serializedFragment(`pipe(
							${a},
							option.fromNullable,
							option.chain(${fn}),
						)`, [serialized_dependency_1.serializedDependency('option', 'fp-ts'), serialized_dependency_1.serializedDependency('pipe', 'fp-ts/lib/pipeable')], [])
    : exports.serializedFragment(`pipe(
							${a},
							${fn},
						)`, [serialized_dependency_1.serializedDependency('pipe', 'fp-ts/lib/pipeable')], []));
exports.commaFragment = exports.serializedFragment(', ', [], []);
