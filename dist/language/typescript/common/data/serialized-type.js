"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_dependency_1 = require("./serialized-dependency");
const Monoid_1 = require("fp-ts/lib/Monoid");
const Foldable_1 = require("fp-ts/lib/Foldable");
const Array_1 = require("fp-ts/lib/Array");
const Eq_1 = require("fp-ts/lib/Eq");
const ref_1 = require("../../../../utils/ref");
const utils_1 = require("../utils");
const array_1 = require("../../../../utils/array");
const string_1 = require("../../../../utils/string");
const NonEmptyArray_1 = require("fp-ts/lib/NonEmptyArray");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const Option_1 = require("fp-ts/lib/Option");
const utils_2 = require("../bundled/utils");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
exports.serializedType = (type, io, dependencies, refs) => ({
    type,
    io,
    dependencies: serialized_dependency_1.uniqSerializedDependencies(dependencies),
    refs: ref_1.uniqRefs(refs),
});
exports.monoidSerializedType = Monoid_1.getStructMonoid({
    type: Monoid_1.monoidString,
    io: Monoid_1.monoidString,
    dependencies: serialized_dependency_1.monoidDependencies,
    refs: Array_1.getMonoid(),
});
exports.foldSerializedTypes = Monoid_1.fold(exports.monoidSerializedType);
exports.intercalateSerializedTypes = Foldable_1.intercalate(exports.monoidSerializedType, Array_1.array);
const eqSerializedTypeByTypeAndIO = Eq_1.getStructEq({
    type: Eq_1.eqString,
    io: Eq_1.eqString,
});
exports.uniqSerializedTypesByTypeAndIO = Array_1.uniq(eqSerializedTypeByTypeAndIO);
exports.SERIALIZED_VOID_TYPE = exports.serializedType('void', 'tvoid', [serialized_dependency_1.serializedDependency('void as tvoid', 'io-ts')], []);
exports.SERIALIZED_UNKNOWN_TYPE = exports.serializedType('unknown', 'unknown', [serialized_dependency_1.serializedDependency('unknown', 'io-ts')], []);
exports.getSerializedBlobType = (from) => {
    return either_utils_1.combineEither(utils_2.utilsRef, utilsRef => exports.serializedType('Blob', 'BlobToBlobIO', [serialized_dependency_1.serializedDependency('BlobToBlobIO', ref_1.getRelativePath(from, utilsRef))], []));
};
exports.SERIALIZED_BOOLEAN_TYPE = exports.serializedType('boolean', 'boolean', [serialized_dependency_1.serializedDependency('boolean', 'io-ts')], []);
exports.SERIALIZED_NUMBER_TYPE = exports.serializedType('number', 'number', [serialized_dependency_1.serializedDependency('number', 'io-ts')], []);
exports.SERIALIZED_INTEGER_TYPE = exports.serializedType('Int', 'Int', [serialized_dependency_1.serializedDependency('Int', 'io-ts')], []);
exports.SERIALIZED_DATETIME_TYPE = exports.serializedType('Date', 'DateFromISOString', [serialized_dependency_1.serializedDependency('DateFromISOString', 'io-ts-types/lib/DateFromISOString')], []);
exports.SERIALIZED_DATE_TYPE = exports.serializedType('Date', 'DateFromISODateStringIO', [serialized_dependency_1.serializedDependency('DateFromISODateStringIO', '../utils/utils')], []);
exports.SERIALIZED_STRING_TYPE = exports.serializedType('string', 'string', [serialized_dependency_1.serializedDependency('string', 'io-ts')], []);
exports.getSerializedStringType = (from, format) => {
    return either_utils_1.combineEither(utils_2.utilsRef, utilsRef => {
        return pipeable_1.pipe(format, fp_ts_1.option.chain(format => {
            // https://xml2rfc.tools.ietf.org/public/rfc/html/rfc3339.html#anchor14
            switch (format) {
                case 'date-time': {
                    return Option_1.some(exports.SERIALIZED_DATETIME_TYPE);
                }
                case 'date': {
                    return Option_1.some(exports.serializedType('Date', 'DateFromISODateStringIO', [serialized_dependency_1.serializedDependency('DateFromISODateStringIO', ref_1.getRelativePath(from, utilsRef))], []));
                }
                case 'byte':
                case 'base64': {
                    return Option_1.some(exports.serializedType('Base64', 'Base64FromStringIO', [
                        serialized_dependency_1.serializedDependency('Base64FromStringIO', ref_1.getRelativePath(from, utilsRef)),
                        serialized_dependency_1.serializedDependency('Base64', ref_1.getRelativePath(from, utilsRef)),
                    ], []));
                }
                case 'binary': {
                    return Option_1.some(exports.serializedType('Binary', 'BinaryFromStringIO', [
                        serialized_dependency_1.serializedDependency('BinaryFromStringIO', ref_1.getRelativePath(from, utilsRef)),
                        serialized_dependency_1.serializedDependency('Binary', ref_1.getRelativePath(from, utilsRef)),
                    ], []));
                }
            }
            return Option_1.none;
        }), fp_ts_1.option.getOrElse(() => exports.SERIALIZED_STRING_TYPE));
    });
};
exports.SERIALIZED_NULL_TYPE = exports.serializedType('null', 'nullType', [serialized_dependency_1.serializedDependency('nullType', 'io-ts')], []);
exports.getSerializedNullableType = (isNullable) => (type) => isNullable ? exports.getSerializedUnionType([type, exports.SERIALIZED_NULL_TYPE]) : type;
exports.getSerializedArrayType = (minItems, name) => (serialized) => pipeable_1.pipe(minItems, Option_1.exists(minItems => minItems > 0), isNonEmpty => isNonEmpty
    ? exports.serializedType(`NonEmptyArray<${serialized.type}>`, `nonEmptyArray(${serialized.io}${string_1.when(name !== undefined, `, '${name}'`)})`, [
        ...serialized.dependencies,
        serialized_dependency_1.serializedDependency('nonEmptyArray', 'io-ts-types/lib/nonEmptyArray'),
        serialized_dependency_1.serializedDependency('NonEmptyArray', 'fp-ts/lib/NonEmptyArray'),
    ], serialized.refs)
    : exports.serializedType(`Array<${serialized.type}>`, `array(${serialized.io}${string_1.when(name !== undefined, `, '${name}'`)})`, [...serialized.dependencies, serialized_dependency_1.serializedDependency('array', 'io-ts')], serialized.refs));
exports.getSerializedRefType = (from) => (to) => {
    const isRecursive = from.$ref === to.$ref;
    const p = ref_1.getRelativePath(from, to);
    const type = utils_1.getTypeName(to.name);
    const io = utils_1.getIOName(to.name);
    const ref = to.name === type ? to : Object.assign(Object.assign({}, to), { name: type });
    const dependencies = array_1.concatIfL(!isRecursive, [], () => [
        serialized_dependency_1.serializedDependency(type, p),
        serialized_dependency_1.serializedDependency(io, p),
    ]);
    return exports.serializedType(type, io, dependencies, [ref]);
};
exports.getSerializedObjectType = (name) => (serialized) => exports.serializedType(`{ ${serialized.type} }`, `type({ ${serialized.io} }${string_1.when(name !== undefined, `, '${name}'`)})`, [...serialized.dependencies, serialized_dependency_1.serializedDependency('type', 'io-ts')], serialized.refs);
exports.getSerializedDictionaryType = (name) => (serialized) => exports.serializedType(`{ [key: string]: ${serialized.type} }`, `record(string, ${serialized.io}${string_1.when(name !== undefined, `, '${name}'`)})`, [...serialized.dependencies, serialized_dependency_1.serializedDependency('record', 'io-ts'), serialized_dependency_1.serializedDependency('string', 'io-ts')], serialized.refs);
exports.getSerializedRecursiveType = (from, shouldTrackRecursion) => (serialized) => {
    const typeName = utils_1.getTypeName(from.name);
    const ioName = utils_1.getIOName(from.name);
    return shouldTrackRecursion && serialized.refs.some(ref => ref.$ref === from.$ref)
        ? exports.serializedType(serialized.type, `recursion<${typeName}, unknown>('${ioName}', ${ioName} => ${serialized.io})`, [...serialized.dependencies, serialized_dependency_1.serializedDependency('recursion', 'io-ts')], serialized.refs)
        : serialized;
};
exports.getSerializedUnionType = (serialized) => {
    if (serialized.length === 1) {
        return NonEmptyArray_1.head(serialized);
    }
    else {
        const intercalated = exports.intercalateSerializedTypes(exports.serializedType(' | ', ',', [], []), serialized);
        return exports.serializedType(`(${intercalated.type})`, `union([${intercalated.io}])`, [...intercalated.dependencies, serialized_dependency_1.serializedDependency('union', 'io-ts')], intercalated.refs);
    }
};
exports.getSerializedIntersectionType = (serialized) => {
    if (serialized.length === 1) {
        return NonEmptyArray_1.head(serialized);
    }
    else {
        const intercalated = exports.intercalateSerializedTypes(exports.serializedType(' & ', ',', [], []), serialized);
        return exports.serializedType(`${intercalated.type}`, `intersection([${intercalated.io}])`, [...intercalated.dependencies, serialized_dependency_1.serializedDependency('intersection', 'io-ts')], intercalated.refs);
    }
};
exports.getSerializedEnumType = (value) => pipeable_1.pipe(value, fp_ts_1.nonEmptyArray.map(exports.getSerializedPrimitiveType), exports.getSerializedUnionType);
exports.getSerializedPrimitiveType = (value) => {
    const serialized = JSON.stringify(value);
    return exports.serializedType(serialized, `literal(${serialized})`, [serialized_dependency_1.LITERAL_DEPENDENCY], []);
};
exports.getSerializedOptionType = (serialized) => exports.serializedType(`Option<${serialized.type}>`, `optionFromNullable(${serialized.io})`, [...serialized.dependencies, ...serialized_dependency_1.OPTION_DEPENDENCIES], serialized.refs);
exports.getSerializedOptionalType = (isRequired, serialized) => isRequired ? serialized : exports.getSerializedOptionType(serialized);
exports.getSerializedPropertyType = (name, isRequired, serialized) => {
    const safeName = utils_1.UNSAFE_PROPERTY_PATTERN.test(name) ? `['${name}']` : name;
    return exports.serializedType(`${safeName}${string_1.when(!isRequired, '?')}: ${serialized.type}`, `${safeName}: ${serialized.io}`, serialized.dependencies, serialized.refs);
};
exports.getSerializedOptionPropertyType = (name, isRequired) => (serialized) => exports.getSerializedPropertyType(name, true, exports.getSerializedOptionalType(isRequired, serialized));
