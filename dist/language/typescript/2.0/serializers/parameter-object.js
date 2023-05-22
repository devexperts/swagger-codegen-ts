"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_type_1 = require("../../common/data/serialized-type");
const items_object_1 = require("./items-object");
const schema_object_1 = require("./schema-object");
const Either_1 = require("fp-ts/lib/Either");
const serialized_parameter_1 = require("../../common/data/serialized-parameter");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const function_1 = require("fp-ts/lib/function");
const Option_1 = require("fp-ts/lib/Option");
exports.serializeParameterObject = (from, parameterObject) => {
    const toSerializedParameter = serialized_parameter_1.fromSerializedType(exports.isRequired(parameterObject));
    switch (parameterObject.in) {
        case 'path':
        case 'query':
        case 'header':
        case 'formData': {
            switch (parameterObject.type) {
                case 'string': {
                    return pipeable_1.pipe(serialized_type_1.getSerializedStringType(from, parameterObject.format), fp_ts_1.either.map(toSerializedParameter));
                }
                case 'number': {
                    return Either_1.right(toSerializedParameter(serialized_type_1.SERIALIZED_NUMBER_TYPE));
                }
                case 'integer': {
                    return Either_1.right(toSerializedParameter(serialized_type_1.SERIALIZED_INTEGER_TYPE));
                }
                case 'boolean': {
                    return Either_1.right(toSerializedParameter(serialized_type_1.SERIALIZED_BOOLEAN_TYPE));
                }
                case 'array': {
                    return pipeable_1.pipe(items_object_1.serializeItemsObject(from, parameterObject.items), fp_ts_1.either.map(serialized_type_1.getSerializedArrayType(Option_1.none)), fp_ts_1.either.map(toSerializedParameter));
                }
                case 'file':
                    return Either_1.right(toSerializedParameter(serialized_type_1.SERIALIZED_UNKNOWN_TYPE));
            }
        }
        case 'body': {
            return pipeable_1.pipe(schema_object_1.serializeSchemaObject(from, parameterObject.schema), fp_ts_1.either.map(toSerializedParameter));
        }
    }
};
exports.isRequired = (parameterObject) => parameterObject.in === 'path'
    ? parameterObject.required
    : pipeable_1.pipe(parameterObject.required, fp_ts_1.option.getOrElse(function_1.constFalse));
