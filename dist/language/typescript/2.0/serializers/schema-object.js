"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_type_1 = require("../../common/data/serialized-type");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const schema_object_1 = require("../../../../schema/2.0/schema-object");
const pipeable_1 = require("fp-ts/lib/pipeable");
const function_1 = require("fp-ts/lib/function");
const array_1 = require("../../../../utils/array");
const ref_1 = require("../../../../utils/ref");
const Either_1 = require("fp-ts/lib/Either");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const fp_ts_1 = require("fp-ts");
const either_1 = require("../../../../utils/either");
const reference_object_1 = require("../../../../schema/2.0/reference-object");
exports.serializeSchemaObject = (from, schema) => serializeSchemaObjectWithRecursion(from, schema, true);
const serializeSchemaObjectWithRecursion = (from, schema, shouldTrackRecursion) => {
    // check non-typed schemas first
    if (reference_object_1.ReferenceObjectCodec.is(schema)) {
        return pipeable_1.pipe(ref_1.fromString(schema.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)));
    }
    if (schema_object_1.EnumSchemaObjectCodec.is(schema)) {
        return Either_1.right(serialized_type_1.getSerializedEnumType(schema.enum));
    }
    if (schema_object_1.AllOfSchemaObject.is(schema)) {
        return serializeAllOf(from, schema.allOf, shouldTrackRecursion);
    }
    // schema is typed
    switch (schema.type) {
        case 'null':
        case 'string':
        case 'number':
        case 'integer':
        case 'boolean': {
            return serializePrimitive(from, schema);
        }
        case 'array': {
            return pipeable_1.pipe(serializeSchemaObjectWithRecursion(from, schema.items, false), fp_ts_1.either.map(result => serialized_type_1.serializedType(`Array<${result.type}>`, `array(${result.io})`, [...result.dependencies, serialized_dependency_1.serializedDependency('array', 'io-ts')], result.refs)));
        }
        case 'object': {
            const additionalProperties = pipeable_1.pipe(schema.additionalProperties, fp_ts_1.option.map(additionalProperties => pipeable_1.pipe(serializeSchemaObjectWithRecursion(from, additionalProperties, false), fp_ts_1.either.map(serialized_type_1.getSerializedDictionaryType()), fp_ts_1.either.map(serialized_type_1.getSerializedRecursiveType(from, shouldTrackRecursion)))));
            const properties = () => pipeable_1.pipe(schema.properties, fp_ts_1.option.map(properties => pipeable_1.pipe(properties, fp_ts_1.record.collect((name, value) => {
                const isRequired = pipeable_1.pipe(schema.required, fp_ts_1.option.map(array_1.includes(name)), fp_ts_1.option.getOrElse(function_1.constFalse));
                return pipeable_1.pipe(serializeSchemaObjectWithRecursion(from, value, false), fp_ts_1.either.map(serialized_type_1.getSerializedOptionPropertyType(name, isRequired)));
            }), either_utils_1.sequenceEither, fp_ts_1.either.map(s => serialized_type_1.intercalateSerializedTypes(serialized_type_1.serializedType(';', ',', [], []), s)), fp_ts_1.either.map(serialized_type_1.getSerializedObjectType(from.name)), fp_ts_1.either.map(serialized_type_1.getSerializedRecursiveType(from, shouldTrackRecursion)))));
            return pipeable_1.pipe(additionalProperties, fp_ts_1.option.alt(properties), fp_ts_1.option.getOrElse(() => Either_1.right(serialized_type_1.SERIALIZED_UNKNOWN_TYPE)));
        }
    }
};
const serializeAllOf = (from, allOf, shouldTrackRecursion) => pipeable_1.pipe(either_1.traverseNEAEither(allOf, item => serializeSchemaObjectWithRecursion(from, item, false)), fp_ts_1.either.map(serialized_type_1.getSerializedIntersectionType), fp_ts_1.either.map(serialized_type_1.getSerializedRecursiveType(from, shouldTrackRecursion)));
const serializePrimitive = (from, schemaObject) => {
    switch (schemaObject.type) {
        case 'null': {
            return Either_1.right(serialized_type_1.SERIALIZED_NULL_TYPE);
        }
        case 'string': {
            return serialized_type_1.getSerializedStringType(from, schemaObject.format);
        }
        case 'number': {
            return Either_1.right(serialized_type_1.SERIALIZED_NUMBER_TYPE);
        }
        case 'integer': {
            return Either_1.right(serialized_type_1.SERIALIZED_INTEGER_TYPE);
        }
        case 'boolean': {
            return Either_1.right(serialized_type_1.SERIALIZED_BOOLEAN_TYPE);
        }
    }
};
