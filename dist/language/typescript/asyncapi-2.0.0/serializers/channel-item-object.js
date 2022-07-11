"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_1 = require("../../../../utils/ref");
const Either_1 = require("fp-ts/lib/Either");
const serialized_type_1 = require("../../common/data/serialized-type");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const operation_object_1 = require("./operation-object");
const types_1 = require("../../../../utils/types");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const client_1 = require("../../common/bundled/client");
const schema_object_1 = require("./schema-object");
const Option_1 = require("fp-ts/lib/Option");
const option_utils_1 = require("@devexperts/utils/dist/adt/option.utils");
const function_1 = require("fp-ts/lib/function");
const string_1 = require("../../../../utils/string");
const serialized_parameter_1 = require("../../common/data/serialized-parameter");
const serialized_path_parameter_1 = require("../../common/data/serialized-path-parameter");
const array_1 = require("../../../../utils/array");
const utils_1 = require("../../common/utils");
const reference_object_1 = require("../../../../schema/asyncapi-2.0.0/reference-object");
const parameter_object_1 = require("../../../../schema/asyncapi-2.0.0/parameter-object");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const serializeChannelPathParameters = reader_utils_1.combineReader(utils_1.context, e => (from, params) => pipeable_1.pipe(params, fp_ts_1.record.collect((key, param) => {
    const parameter = reference_object_1.ReferenceObjectCodec.is(param)
        ? Option_1.fromEither(e.resolveRef(param.$ref, parameter_object_1.ParameterObjectCodec))
        : fp_ts_1.option.some(param);
    const schema = pipeable_1.pipe(parameter, fp_ts_1.option.chain(parameter => parameter.schema), fp_ts_1.either.fromOption(() => new Error(`Parameter ${key} must have a schema`)), fp_ts_1.either.chain(schema => schema_object_1.serializeSchemaObject(from, schema)));
    return pipeable_1.pipe(schema, fp_ts_1.either.map(schema => serialized_path_parameter_1.serializedPathParameter(key, schema.type, schema.io, true, schema.dependencies, schema.refs)));
})));
exports.serializeChannelItemObject = reader_utils_1.combineReader(serializeChannelPathParameters, serializeChannelPathParameters => (from, channel, channelItemObject, kind) => {
    const send = pipeable_1.pipe(channelItemObject.subscribe, fp_ts_1.option.map(operation => operation_object_1.serializeSubscribeOperationObject(from, channel, operation, kind)));
    const message = pipeable_1.pipe(channelItemObject.publish, fp_ts_1.option.map(operation => operation_object_1.serializePublishOperationObject(from, channel, operation)));
    const serialized = pipeable_1.pipe(fp_ts_1.array.compact([send, message]), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized => serialized_type_1.intercalateSerializedTypes(serialized_type_1.serializedType(';', ',', [], []), serialized)));
    const ws = pipeable_1.pipe(channelItemObject.bindings, fp_ts_1.option.chain(bindings => bindings.ws));
    const method = pipeable_1.pipe(ws, fp_ts_1.option.chain(ws => ws.method), fp_ts_1.option.getOrElse(() => 'GET'));
    const query = pipeable_1.pipe(ws, fp_ts_1.option.chain(ws => ws.query), fp_ts_1.option.map(query => {
        const required = isRequired(query);
        return pipeable_1.pipe(validateSchemaObject(query), fp_ts_1.either.chain(query => schema_object_1.serializeSchemaObject(from, query)), fp_ts_1.either.map(serialized => serialized_type_1.getSerializedPropertyType('query', required, serialized)), fp_ts_1.either.map(serialized_parameter_1.fromSerializedType(required)));
    }));
    const headers = pipeable_1.pipe(ws, fp_ts_1.option.chain(ws => ws.headers), fp_ts_1.option.map(headers => {
        const required = isRequired(headers);
        return pipeable_1.pipe(validateSchemaObject(headers), fp_ts_1.either.chain(headers => schema_object_1.serializeSchemaObject(from, headers)), fp_ts_1.either.map(serialized => serialized_type_1.getSerializedPropertyType('headers', required, serialized)), fp_ts_1.either.map(serialized_parameter_1.fromSerializedType(required)));
    }));
    const bindingParameters = pipeable_1.pipe(fp_ts_1.array.compact([query, headers]), either_utils_1.sequenceEither);
    const channelParameters = pipeable_1.pipe(channelItemObject.parameters, fp_ts_1.option.map(params => serializeChannelPathParameters(from, params)), fp_ts_1.option.getOrElse(() => []), either_utils_1.sequenceEither);
    return either_utils_1.combineEither(serialized, client_1.clientRef, bindingParameters, channelParameters, (serialized, clientRef, bindingParameters, channelParameters) => {
        const serializedBindingParameters = serialized_parameter_1.intercalateSerializedParameters(serialized_parameter_1.serializedParameter(';', ',', false, [], []), bindingParameters);
        const serializedPathParameters = serialized_parameter_1.intercalateSerializedParameters(serialized_parameter_1.serializedParameter(';', ',', false, [], []), channelParameters
            .map(param => serialized_type_1.getSerializedPropertyType(param.name, true, param))
            .map(serialized_parameter_1.fromSerializedType(true)));
        const allSerializedParameters = serialized_parameter_1.intercalateSerializedParameters(serialized_parameter_1.serializedParameter(';', ',', false, [], []), [serializedBindingParameters, serializedPathParameters].filter(x => x.type.length));
        const encodedChannelParameters = channelParameters.map(param => (Object.assign(Object.assign({}, serialized_path_parameter_1.getSerializedPathParameterType(param)), { io: `${param.io}.encode(parameters.${param.name})` })));
        const hasBindingParameters = bindingParameters.length > 0;
        const hasChannelParameters = channelParameters.length > 0;
        const hasParameters = hasBindingParameters || hasChannelParameters;
        const channelType = types_1.foldKind(kind, 'WebSocketClient', 'WebSocketClient1', 'WebSocketClient2');
        const type = `(${string_1.when(hasParameters, `parameters: { ${allSerializedParameters.type} }`)}) => { ${serialized.type} }`;
        const io = `(${string_1.when(hasParameters, 'parameters')}) => {
			${string_1.when(hasBindingParameters, `const encoded = partial({ ${serializedBindingParameters.io} }).encode(parameters);`)}
			const channel = e.webSocketClient.channel({
				channel: ${utils_1.getURL(channel, encodedChannelParameters)},
				method: '${method}',
				${string_1.when(hasBindingParameters, '...encoded,')}
			})

			return { ${serialized.io} };
		}`;
        const dependencies = array_1.concatIf(hasParameters, [
            ...serialized.dependencies,
            ...allSerializedParameters.dependencies,
            serialized_dependency_1.serializedDependency(channelType, ref_1.getRelativePath(from, clientRef)),
        ], [serialized_dependency_1.serializedDependency('partial', 'io-ts')]);
        const refs = [...serialized.refs, ...allSerializedParameters.refs];
        return pipeable_1.pipe(serialized_type_1.serializedType(type, io, dependencies, refs), serialized_type_1.getSerializedOptionPropertyType(channel, true));
    });
});
const validateSchemaObject = (schemaObject) => Option_1.isSome(schemaObject.properties)
    ? Either_1.right(schemaObject)
    : Either_1.left(new Error(`ChannelItemObject.query and ChannelItemObject.header should have "properties" field`));
const isRequired = (objectSchemaObject) => pipeable_1.pipe(option_utils_1.sequenceTOption(objectSchemaObject.properties, objectSchemaObject.required), fp_ts_1.option.map(([properties, required]) => fp_ts_1.record.keys(properties).some(key => required.has(key))), fp_ts_1.option.getOrElse(function_1.constFalse));
