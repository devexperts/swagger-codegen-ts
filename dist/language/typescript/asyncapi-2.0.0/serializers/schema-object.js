"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_1 = require("../../../../utils/ref");
const Either_1 = require("fp-ts/lib/Either");
const serialized_type_1 = require("../../common/data/serialized-type");
const schema_object_1 = require("../../../../schema/asyncapi-2.0.0/schema-object");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const reference_object_1 = require("../../../../schema/asyncapi-2.0.0/reference-object");
const either_1 = require("../../../../utils/either");
const function_1 = require("fp-ts/lib/function");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
exports.serializeSchemaObject = (from, schemaObject, name) => serializeSchemaObjectWithRecursion(from, schemaObject, true, name);
const serializeSchemaObjectWithRecursion = (from, schemaObject, shouldTrackRecursion, name) => {
    // check non-types schemas
    if (schema_object_1.EnumSchemaObjectCodec.is(schemaObject)) {
        return Either_1.right(serialized_type_1.getSerializedEnumType(schemaObject.enum));
    }
    if (schema_object_1.ConstSchemaObjectCodec.is(schemaObject)) {
        return Either_1.right(serialized_type_1.getSerializedPrimitiveType(schemaObject.const));
    }
    if (schema_object_1.AllOfSchemaObjectCodec.is(schemaObject)) {
        return serializeAllOf(from, schemaObject.allOf, shouldTrackRecursion);
    }
    if (schema_object_1.OneOfSchemaObjectCodec.is(schemaObject)) {
        return serializeOneOf(from, schemaObject.oneOf, shouldTrackRecursion);
    }
    // schema is typed at this point
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
        case 'object': {
            return serializeObjectSchemaObject(from, schemaObject, shouldTrackRecursion, name);
        }
        case 'array': {
            return serializeArray(from, schemaObject, shouldTrackRecursion, name);
        }
    }
};
const serializeChildren = (from, value) => either_1.traverseNEAEither(value, item => reference_object_1.ReferenceObjectCodec.is(item)
    ? pipeable_1.pipe(ref_1.fromString(item.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)))
    : serializeSchemaObjectWithRecursion(from, item, false));
const serializeAllOf = (from, value, shouldTrackRecursion) => pipeable_1.pipe(serializeChildren(from, value), fp_ts_1.either.map(serialized_type_1.getSerializedIntersectionType), fp_ts_1.either.map(serialized_type_1.getSerializedRecursiveType(from, shouldTrackRecursion)));
const serializeOneOf = (from, value, shouldTrackRecursion) => pipeable_1.pipe(serializeChildren(from, value), fp_ts_1.either.map(serialized_type_1.getSerializedUnionType), fp_ts_1.either.map(serialized_type_1.getSerializedRecursiveType(from, shouldTrackRecursion)));
const serializeObjectSchemaObject = (from, value, shouldTrackRecursion, name) => pipeable_1.pipe(value.additionalProperties, fp_ts_1.option.map(properties => serializeAdditionalProperties(from, properties, shouldTrackRecursion, name)), fp_ts_1.option.alt(() => serializeProperties(from, value, shouldTrackRecursion, name)), fp_ts_1.option.getOrElse(() => Either_1.right(serialized_type_1.SERIALIZED_UNKNOWN_TYPE)));
const serializeAdditionalProperties = (from, properties, shouldTrackRecursion, name) => {
    const serialized = reference_object_1.ReferenceObjectCodec.is(properties)
        ? pipeable_1.pipe(ref_1.fromString(properties.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)))
        : serializeSchemaObjectWithRecursion(from, properties, false);
    return pipeable_1.pipe(serialized, fp_ts_1.either.map(serialized_type_1.getSerializedDictionaryType(name)), fp_ts_1.either.map(serialized_type_1.getSerializedRecursiveType(from, shouldTrackRecursion)));
};
const serializeProperties = (from, schemaObject, shouldTrackRecursion, name) => pipeable_1.pipe(schemaObject.properties, fp_ts_1.option.map(properties => pipeable_1.pipe(properties, fp_ts_1.record.collect((name, property) => {
    const isRequired = pipeable_1.pipe(schemaObject.required, fp_ts_1.option.map(required => required.has(name)), fp_ts_1.option.getOrElse(function_1.constFalse));
    const serialized = reference_object_1.ReferenceObjectCodec.is(property)
        ? pipeable_1.pipe(ref_1.fromString(property.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)))
        : serializeSchemaObjectWithRecursion(from, property, false);
    return pipeable_1.pipe(serialized, fp_ts_1.either.map(serialized_type_1.getSerializedOptionPropertyType(name, isRequired)));
}), either_utils_1.sequenceEither, fp_ts_1.either.map(s => serialized_type_1.intercalateSerializedTypes(serialized_type_1.serializedType(';', ',', [], []), s)), fp_ts_1.either.map(serialized_type_1.getSerializedObjectType(name)), fp_ts_1.either.map(serialized_type_1.getSerializedRecursiveType(from, shouldTrackRecursion)))));
const serializeArray = (from, schemaObject, shouldTrackRecursion, name) => {
    const serialized = reference_object_1.ReferenceObjectCodec.is(schemaObject.items)
        ? pipeable_1.pipe(ref_1.fromString(schemaObject.items.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)))
        : serializeSchemaObjectWithRecursion(from, schemaObject.items, false);
    return pipeable_1.pipe(serialized, fp_ts_1.either.map(serialized_type_1.getSerializedArrayType(schemaObject.minItems, name)));
};
