"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("fp-ts/lib/Either");
const fs_1 = require("../../../../utils/fs");
const schema_object_1 = require("./schema-object");
const pipeable_1 = require("fp-ts/lib/pipeable");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const fp_ts_1 = require("fp-ts");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const utils_1 = require("../../common/utils");
const ref_1 = require("../../../../utils/ref");
const schema_object_2 = require("../../../../schema/3.0/schema-object");
const parameter_object_1 = require("../../../../schema/3.0/parameter-object");
const parameter_object_2 = require("./parameter-object");
const reference_object_1 = require("../../../../schema/3.0/reference-object");
const response_object_1 = require("../../../../schema/3.0/response-object");
const serialized_type_1 = require("../../common/data/serialized-type");
const response_object_2 = require("./response-object");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const request_body_object_1 = require("../../../../schema/3.0/request-body-object");
const request_body_object_2 = require("./request-body-object");
const serializeSchema = reader_utils_1.combineReader(schema_object_1.serializeSchemaObject, serializeSchemaObject => (from, schema) => {
    const typeName = utils_1.getTypeName(from.name);
    const ioName = utils_1.getIOName(from.name);
    const serialized = pipeable_1.pipe(schema, serializeSchemaObject(from, typeName));
    const dependencies = pipeable_1.pipe(serialized, fp_ts_1.either.map(serialized => serialized_dependency_1.serializeDependencies(serialized.dependencies)));
    return either_utils_1.combineEither(serialized, dependencies, (serialized, dependencies) => fs_1.file(`${from.name}.ts`, `
			${dependencies}

			export type ${typeName} = ${serialized.type};
			export const ${ioName} = ${serialized.io};
		`));
});
const serializeSchemas = reader_utils_1.combineReader(utils_1.context, serializeSchema, (e, serializeSchema) => (from, schemas) => pipeable_1.pipe(schemas, fp_ts_1.record.collect((name, schema) => {
    const resolved = reference_object_1.ReferenceObjectCodec.is(schema)
        ? e.resolveRef(schema.$ref, schema_object_2.SchemaObjectCodec)
        : Either_1.right(schema);
    const ref = pipeable_1.pipe(from, ref_1.addPathParts('schemas', name));
    return pipeable_1.pipe(either_utils_1.sequenceTEither(resolved, ref), fp_ts_1.either.chain(([resolved, ref]) => serializeSchema(ref, resolved)));
}), either_utils_1.sequenceEither, fp_ts_1.either.map(content => fs_1.directory('schemas', content))));
const serializeParameter = reader_utils_1.combineReader(parameter_object_2.serializeParameterObject, serializeParameterObject => (from, parameterObject) => pipeable_1.pipe(serializeParameterObject(from, parameterObject), fp_ts_1.either.map(serialized => {
    const dependencies = serialized_dependency_1.serializeDependencies(serialized.dependencies);
    return fs_1.file(`${from.name}.ts`, `
					${dependencies}

					export type ${utils_1.getTypeName(from.name)} = ${serialized.type};
					export const ${utils_1.getIOName(from.name)} = ${serialized.io};
				`);
})));
const serializeParameters = reader_utils_1.combineReader(utils_1.context, serializeParameter, (e, serializeParameter) => (from, parameters) => pipeable_1.pipe(parameters, fp_ts_1.record.collect((name, parameter) => {
    const resolved = reference_object_1.ReferenceObjectCodec.is(parameter)
        ? e.resolveRef(parameter.$ref, parameter_object_1.ParameterObjectCodec)
        : Either_1.right(parameter);
    const ref = pipeable_1.pipe(from, ref_1.addPathParts('parameters', name));
    return pipeable_1.pipe(either_utils_1.sequenceTEither(resolved, ref), fp_ts_1.either.chain(([parameter, from]) => serializeParameter(from, parameter)));
}), either_utils_1.sequenceEither, fp_ts_1.either.map(content => fs_1.directory('parameters', content))));
const serializeResponse = reader_utils_1.combineReader(response_object_2.serializeResponseObject, serializeResponseObject => (from, responseObject) => pipeable_1.pipe(serializeResponseObject(from, responseObject), fp_ts_1.option.getOrElse(() => Either_1.right(serialized_type_1.SERIALIZED_VOID_TYPE)), fp_ts_1.either.map(serialized => {
    const dependencies = serialized_dependency_1.serializeDependencies(serialized.dependencies);
    return fs_1.file(`${from.name}.ts`, `
					${dependencies}

					export type ${utils_1.getTypeName(from.name)} = ${serialized.type};
					export const ${utils_1.getIOName(from.name)} = ${serialized.io};
				`);
})));
const serializeResponses = reader_utils_1.combineReader(utils_1.context, serializeResponse, (e, serializeResponse) => (from, responses) => pipeable_1.pipe(responses, fp_ts_1.record.collect((name, response) => {
    const resolved = reference_object_1.ReferenceObjectCodec.is(response)
        ? e.resolveRef(response.$ref, response_object_1.ResponseObjectCodec)
        : Either_1.right(response);
    const ref = pipeable_1.pipe(from, ref_1.addPathParts('responses', name));
    return pipeable_1.pipe(either_utils_1.sequenceTEither(resolved, ref), fp_ts_1.either.chain(([resolved, ref]) => serializeResponse(ref, resolved)));
}), either_utils_1.sequenceEither, fp_ts_1.either.map(content => fs_1.directory('responses', content))));
const serializeRequestBody = reader_utils_1.combineReader(request_body_object_2.serializeRequestBodyObject, serializeRequestBodyObject => (from, requestBody) => pipeable_1.pipe(serializeRequestBodyObject(from, requestBody), fp_ts_1.either.map(serialized => fs_1.file(`${from.name}.ts`, `
					${serialized_dependency_1.serializeDependencies(serialized.dependencies)}

					export type ${utils_1.getTypeName(from.name)} = ${serialized.type};
					export const ${utils_1.getIOName(from.name)} = ${serialized.io};
				`))));
const serializeRequestBodies = reader_utils_1.combineReader(utils_1.context, serializeRequestBody, (e, serializeRequestBody) => (from, requestBodies) => {
    return pipeable_1.pipe(requestBodies, fp_ts_1.record.collect((name, requestBody) => {
        const resolved = reference_object_1.ReferenceObjectCodec.is(requestBody)
            ? e.resolveRef(requestBody.$ref, request_body_object_1.RequestBodyObjectCodec)
            : Either_1.right(requestBody);
        const ref = pipeable_1.pipe(from, ref_1.addPathParts('requestBodies', name));
        return pipeable_1.pipe(either_utils_1.sequenceTEither(resolved, ref), fp_ts_1.either.chain(([resolved, ref]) => serializeRequestBody(ref, resolved)));
    }), either_utils_1.sequenceEither, fp_ts_1.either.map(content => fs_1.directory('requestBodies', content)));
});
exports.serializeComponentsObject = reader_utils_1.combineReader(serializeParameters, serializeResponses, serializeSchemas, serializeRequestBodies, (serializeParameters, serializeResponses, serializeSchemas, serializeRequestBodies) => (from) => (componentsObject) => {
    const schemas = pipeable_1.pipe(componentsObject.schemas, fp_ts_1.option.map(schemas => serializeSchemas(from, schemas)));
    const parameters = pipeable_1.pipe(componentsObject.parameters, fp_ts_1.option.map(parameters => serializeParameters(from, parameters)));
    const responses = pipeable_1.pipe(componentsObject.responses, fp_ts_1.option.map(responses => serializeResponses(from, responses)));
    const requestBodies = pipeable_1.pipe(componentsObject.requestBodies, fp_ts_1.option.map(requestBodies => serializeRequestBodies(from, requestBodies)));
    return pipeable_1.pipe([schemas, parameters, responses, requestBodies], fp_ts_1.array.compact, either_utils_1.sequenceEither, fp_ts_1.either.map(content => fs_1.directory('components', content)));
});
