"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_parameter_1 = require("../../common/data/serialized-parameter");
const Either_1 = require("fp-ts/lib/Either");
const schema_object_1 = require("./schema-object");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const serialized_type_1 = require("../../common/data/serialized-type");
const ref_1 = require("../../../../utils/ref");
const reference_object_1 = require("../../../../schema/3.0/reference-object");
const function_1 = require("fp-ts/lib/function");
const schema_object_2 = require("../../../../schema/3.0/schema-object");
const serialized_fragment_1 = require("../../common/data/serialized-fragment");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const openapi_3_utils_1 = require("../bundled/openapi-3-utils");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const forParameter = (parameter) => `for parameter "${parameter.name}" in "${parameter.in}"`;
exports.isRequired = (parameter) => parameter.in === 'path' ? parameter.required : pipeable_1.pipe(parameter.required, fp_ts_1.option.getOrElse(function_1.constFalse));
exports.serializeParameterObject = reader_utils_1.combineReader(schema_object_1.serializeSchemaObject, serializeSchemaObject => (from, parameterObject) => pipeable_1.pipe(exports.getParameterObjectSchema(parameterObject), fp_ts_1.either.chain(schema => {
    if (reference_object_1.ReferenceObjectCodec.is(schema)) {
        return pipeable_1.pipe(ref_1.fromString(schema.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)));
    }
    else {
        return pipeable_1.pipe(schema, serializeSchemaObject(from));
    }
}), fp_ts_1.either.map(serialized_parameter_1.fromSerializedType(exports.isRequired(parameterObject)))));
exports.getParameterObjectSchema = (parameterObject) => pipeable_1.pipe(parameterObject.schema, fp_ts_1.option.alt(() => pipeable_1.pipe(parameterObject.content, fp_ts_1.option.chain(content => fp_ts_1.record.lookup('application/json', content)), fp_ts_1.option.chain(media => media.schema))), fp_ts_1.either.fromOption(() => new Error(`Unable to get schema ${forParameter(parameterObject)}`)));
const getParameterObjectStyle = (parameter) => pipeable_1.pipe(parameter.style, fp_ts_1.option.getOrElse(() => {
    switch (parameter.in) {
        case 'path': {
            return 'simple';
        }
        case 'header': {
            return 'simple';
        }
        case 'query': {
            return 'form';
        }
        case 'cookie': {
            return 'form';
        }
    }
}));
const getParameterExplode = (parameter) => pipeable_1.pipe(parameter.explode, fp_ts_1.option.getOrElse(() => getParameterObjectStyle(parameter) === 'form'));
exports.serializeQueryParameterToTemplate = (from, parameter, parameterSchema, serializedSchema, target) => {
    if (Either_1.isLeft(openapi_3_utils_1.openapi3utilsRef)) {
        return openapi_3_utils_1.openapi3utilsRef;
    }
    const pathToUtils = ref_1.getRelativePath(from, openapi_3_utils_1.openapi3utilsRef.right);
    const required = exports.isRequired(parameter);
    const encoded = serialized_fragment_1.serializedFragment(`${serializedSchema.io}.encode(${target}['${parameter.name}'])`, serializedSchema.dependencies, serializedSchema.refs);
    return pipeable_1.pipe(getFn(pathToUtils, parameterSchema, parameter), fp_ts_1.either.map(fn => serialized_fragment_1.getSerializedOptionCallFragment(!required, fn, encoded)));
};
const getFn = (pathToUtils, schema, parameter) => {
    const explode = getParameterExplode(parameter);
    const style = getParameterObjectStyle(parameter);
    if (schema_object_2.PrimitiveSchemaObjectCodec.is(schema)) {
        return Either_1.right(serialized_fragment_1.serializedFragment(`value => fromEither(serializePrimitiveParameter('${style}', '${parameter.name}', value))`, [
            serialized_dependency_1.serializedDependency('fromEither', 'fp-ts/lib/Option'),
            serialized_dependency_1.serializedDependency('serializePrimitiveParameter', pathToUtils),
        ], []));
    }
    if (schema_object_2.ArraySchemaObjectCodec.is(schema)) {
        return Either_1.right(serialized_fragment_1.serializedFragment(`value => fromEither(serializeArrayParameter('${style}', '${parameter.name}', value, ${explode}))`, [
            serialized_dependency_1.serializedDependency('fromEither', 'fp-ts/lib/Option'),
            serialized_dependency_1.serializedDependency('serializeArrayParameter', pathToUtils),
        ], []));
    }
    if (schema_object_2.ObjectSchemaObjectCodec.is(schema)) {
        return Either_1.right(serialized_fragment_1.serializedFragment(`value => fromEither(serializeObjectParameter('${style}', '${parameter.name}', value, ${explode}))`, [
            serialized_dependency_1.serializedDependency('fromEither', 'fp-ts/lib/Option'),
            serialized_dependency_1.serializedDependency('serializeObjectParameter', pathToUtils),
        ], []));
    }
    return Either_1.left(new Error(`Unsupported schema for parameter "${parameter.name}"`));
};
