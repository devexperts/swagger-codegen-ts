"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pipeable_1 = require("fp-ts/lib/pipeable");
const NonEmptyArray_1 = require("fp-ts/lib/NonEmptyArray");
const Record_1 = require("fp-ts/lib/Record");
const array_1 = require("../../../../utils/array");
const Array_1 = require("fp-ts/lib/Array");
const Eq_1 = require("fp-ts/lib/Eq");
const fp_ts_1 = require("fp-ts");
const Ord_1 = require("fp-ts/lib/Ord");
exports.serializedDependency = (name, path) => ({
    name,
    path,
});
exports.serializeDependencies = (dependencies) => pipeable_1.pipe(dependencies, NonEmptyArray_1.groupBy(dependency => dependency.path), Record_1.collect((key, dependencies) => {
    const names = pipeable_1.pipe(array_1.uniqString(dependencies.map(dependency => dependency.name)), array_1.join(','));
    return `import { ${names} } from '${NonEmptyArray_1.head(dependencies).path}';`;
}), array_1.join(''));
exports.ordDependencyByPath = fp_ts_1.ord.contramap((dep) => dep.path)(Ord_1.ordString);
exports.ordDependencyByName = fp_ts_1.ord.contramap((dep) => dep.name)(Ord_1.ordString);
exports.monoidDependencies = Array_1.getMonoid();
const dependencyOption = exports.serializedDependency('Option', 'fp-ts/lib/Option');
const dependencyOptionFromNullable = exports.serializedDependency('optionFromNullable', 'io-ts-types/lib/optionFromNullable');
exports.OPTION_DEPENDENCIES = [dependencyOption, dependencyOptionFromNullable];
exports.LITERAL_DEPENDENCY = exports.serializedDependency('literal', 'io-ts');
exports.eqSerializedDependency = Eq_1.getStructEq({
    name: Eq_1.eqString,
    path: Eq_1.eqString,
});
exports.uniqSerializedDependencies = Array_1.uniq(exports.eqSerializedDependency);
exports.getSerializedKindDependency = (kind) => {
    switch (kind) {
        case 'HKT': {
            return exports.serializedDependency('HKT', 'fp-ts/lib/HKT');
        }
        case '*': {
            return exports.serializedDependency('Kind', 'fp-ts/lib/HKT');
        }
        case '* -> *': {
            return exports.serializedDependency('Kind2', 'fp-ts/lib/HKT');
        }
    }
};
