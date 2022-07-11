"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../common/utils");
const serialized_type_1 = require("../../common/data/serialized-type");
const parameter_object_1 = require("./parameter-object");
const pipeable_1 = require("fp-ts/lib/pipeable");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const responses_object_1 = require("./responses-object");
const fp_ts_1 = require("fp-ts");
const Either_1 = require("fp-ts/lib/Either");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const serialized_parameter_1 = require("../../common/data/serialized-parameter");
const serialized_path_parameter_1 = require("../../common/data/serialized-path-parameter");
const array_1 = require("../../../../utils/array");
const string_1 = require("../../../../utils/string");
const request_body_object_1 = require("./request-body-object");
const ref_1 = require("../../../../utils/ref");
const parameter_object_2 = require("../../../../schema/3.0/parameter-object");
const request_body_object_2 = require("../../../../schema/3.0/request-body-object");
const Option_1 = require("fp-ts/lib/Option");
const function_1 = require("fp-ts/lib/function");
const client_1 = require("../../common/bundled/client");
const reference_object_1 = require("../../../../schema/3.0/reference-object");
const Eq_1 = require("fp-ts/lib/Eq");
const Reader_1 = require("fp-ts/lib/Reader");
const serialized_fragment_1 = require("../../common/data/serialized-fragment");
const schema_object_1 = require("../../../../schema/3.0/schema-object");
const serialized_header_parameters_1 = require("../../common/data/serialized-header-parameters");
exports.getOperationName = (pattern, operation, method) => pipeable_1.pipe(operation.operationId, fp_ts_1.option.getOrElse(() => `${method}_${utils_1.getSafePropertyName(pattern)}`));
const eqParameterByNameAndIn = Eq_1.getStructEq({
    name: Eq_1.eqString,
    in: Eq_1.eqString,
});
const contains = fp_ts_1.array.elem(eqParameterByNameAndIn);
exports.getParameters = reader_utils_1.combineReader(Reader_1.ask(), parameter_object_1.serializeParameterObject, request_body_object_1.serializeRequestBodyObject, (e, serializeParameterObject, serializeRequestBodyObject) => (from, operation, pathItem) => {
    const processedParameters = [];
    const pathParameters = [];
    const serializedPathParameters = [];
    const serializedQueryParameters = [];
    let serializedBodyParameter = Option_1.none;
    const queryStringFragments = [];
    const serializedHeaderParameters = [];
    // note that PathItem parameters should go after OperationObject parameters because they have lower priority
    // this means that OperationObject can override PathItemObject parameters
    const parameters = fp_ts_1.array.flatten(fp_ts_1.array.compact([operation.parameters, pathItem.parameters]));
    for (const parameter of parameters) {
        const resolved = reference_object_1.ReferenceObjectCodec.is(parameter)
            ? e.resolveRef(parameter.$ref, parameter_object_2.ParameterObjectCodec)
            : Either_1.right(Object.assign(Object.assign({}, parameter), { name: utils_1.getTypeName(parameter.name) }));
        if (Either_1.isLeft(resolved)) {
            return resolved;
        }
        // if parameter has already been processed then skip it
        if (contains(resolved.right, processedParameters)) {
            continue;
        }
        processedParameters.push(resolved.right);
        const required = parameter_object_1.isRequired(resolved.right);
        const serialized = reference_object_1.ReferenceObjectCodec.is(parameter)
            ? pipeable_1.pipe(ref_1.fromString(parameter.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)), fp_ts_1.either.map(serialized_parameter_1.fromSerializedType(required)))
            : serializeParameterObject(from, resolved.right);
        if (Either_1.isLeft(serialized)) {
            return serialized;
        }
        switch (resolved.right.in) {
            case 'path': {
                pathParameters.push(resolved.right);
                const serializedParameter = pipeable_1.pipe(serialized.right, serialized_path_parameter_1.fromSerializedParameter(resolved.right.name), serialized_path_parameter_1.getSerializedPathParameterType);
                serializedPathParameters.push(serializedParameter);
                break;
            }
            case 'header': {
                const serializedParameter = pipeable_1.pipe(serialized.right, serialized_header_parameters_1.fromSerializedHeaderParameter(resolved.right.name), serialized_header_parameters_1.getSerializedHeaderParameterType);
                serializedHeaderParameters.push(serializedParameter);
                break;
            }
            case 'query': {
                const serializedParameter = serialized_type_1.getSerializedOptionalType(required, serialized.right);
                const schema = parameter_object_1.getParameterObjectSchema(resolved.right);
                const resolvedSchema = pipeable_1.pipe(schema, fp_ts_1.either.chain(schema => reference_object_1.ReferenceObjectCodec.is(schema)
                    ? e.resolveRef(schema.$ref, schema_object_1.SchemaObjectCodec)
                    : Either_1.right(schema)));
                if (Either_1.isLeft(resolvedSchema)) {
                    return resolvedSchema;
                }
                const queryStringFragment = parameter_object_1.serializeQueryParameterToTemplate(from, resolved.right, resolvedSchema.right, serializedParameter, 'parameters.query');
                if (Either_1.isLeft(queryStringFragment)) {
                    return queryStringFragment;
                }
                queryStringFragments.push(queryStringFragment.right);
                serializedQueryParameters.push(serialized_type_1.getSerializedPropertyType(resolved.right.name, true, serializedParameter));
                break;
            }
        }
    }
    if (Option_1.isSome(operation.requestBody)) {
        const requestBody = operation.requestBody.value;
        if (reference_object_1.ReferenceObjectCodec.is(requestBody)) {
            const reference = ref_1.fromString(requestBody.$ref);
            if (Either_1.isLeft(reference)) {
                return Either_1.left(new Error(`Invalid RequestBodyObject.$ref "${requestBody.$ref}"`));
            }
            const resolved = fp_ts_1.option.fromEither(e.resolveRef(requestBody.$ref, request_body_object_2.RequestBodyObjectCodec));
            if (!Option_1.isSome(resolved)) {
                return Either_1.left(new Error(`Unable to resolve RequestBodyObject with ref ${requestBody.$ref}`));
            }
            const serializedReference = pipeable_1.pipe(reference.right, serialized_type_1.getSerializedRefType(from));
            const required = pipeable_1.pipe(resolved.value.required, fp_ts_1.option.getOrElse(function_1.constFalse));
            serializedBodyParameter = Option_1.some(serialized_type_1.getSerializedOptionalType(required, serializedReference));
        }
        else {
            const required = pipeable_1.pipe(requestBody.required, fp_ts_1.option.getOrElse(function_1.constFalse));
            const serialized = pipeable_1.pipe(serializeRequestBodyObject(from, requestBody), fp_ts_1.either.map(serialized => serialized_type_1.getSerializedOptionalType(required, serialized)));
            if (Either_1.isLeft(serialized)) {
                return serialized;
            }
            serializedBodyParameter = Option_1.some(serialized.right);
        }
    }
    const serializedQueryParameter = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(serializedQueryParameters), fp_ts_1.option.map(parameters => {
        const intercalated = serialized_type_1.intercalateSerializedTypes(serialized_type_1.serializedType(';', ',', [], []), parameters);
        return pipeable_1.pipe(intercalated, serialized_type_1.getSerializedObjectType());
    }));
    const serializedQueryString = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(queryStringFragments), fp_ts_1.option.map(queryStringFragments => serialized_fragment_1.intercalateSerializedFragmentsNEA(serialized_fragment_1.serializedFragment(',', [], []), queryStringFragments)), fp_ts_1.option.map(f => serialized_fragment_1.combineFragmentsK(f, c => serialized_fragment_1.serializedFragment(`compact([${c}]).join('&')`, [serialized_dependency_1.serializedDependency('compact', 'fp-ts/lib/Array')], []))));
    const serializedHeadersParameter = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(serializedHeaderParameters), fp_ts_1.option.map(parameters => pipeable_1.pipe(serialized_type_1.intercalateSerializedTypes(serialized_type_1.serializedType(';', ',', [], []), parameters), serialized_type_1.getSerializedObjectType())));
    return Either_1.right({
        pathParameters,
        serializedPathParameters,
        serializedQueryParameter,
        serializedHeadersParameter,
        serializedBodyParameter,
        serializedQueryString,
    });
});
exports.serializeOperationObject = reader_utils_1.combineReader(Reader_1.ask(), exports.getParameters, responses_object_1.serializeResponsesObject, (e, getParameters, serializeResponsesObject) => (pattern, method, from, kind, operation, pathItem) => {
    const parameters = getParameters(from, operation, pathItem);
    const operationName = exports.getOperationName(pattern, operation, method);
    const deprecated = pipeable_1.pipe(operation.deprecated, fp_ts_1.option.map(() => '@deprecated'));
    const serializedResponses = serializeResponsesObject(from)(operation.responses);
    const serializedContentType = pipeable_1.pipe(operation.requestBody, Option_1.chain(requestBody => reference_object_1.ReferenceObjectCodec.is(requestBody)
        ? Option_1.fromEither(e.resolveRef(requestBody.$ref, request_body_object_2.RequestBodyObjectCodec))
        : Option_1.some(requestBody)), Option_1.map(request => request.content), Option_1.chain(request_body_object_1.getRequestMedia), Option_1.map(({ key }) => key), Option_1.fold(() => '', contentType => `'Content-type': '${contentType}',`));
    return either_utils_1.combineEither(parameters, serializedResponses, client_1.clientRef, (parameters, serializedResponses, clientRef) => {
        const hasQueryParameters = Option_1.isSome(parameters.serializedQueryParameter);
        const hasBodyParameter = Option_1.isSome(parameters.serializedBodyParameter);
        const hasHeaderParameters = Option_1.isSome(parameters.serializedHeadersParameter);
        const hasParameters = hasQueryParameters || hasBodyParameter || hasHeaderParameters;
        const bodyType = pipeable_1.pipe(parameters.serializedBodyParameter, fp_ts_1.option.map(body => `body: ${body.type},`), fp_ts_1.option.getOrElse(() => ''));
        const bodyIO = pipeable_1.pipe(parameters.serializedBodyParameter, fp_ts_1.option.map(body => `const body = ${body.io}.encode(parameters.body);`), fp_ts_1.option.getOrElse(() => ''));
        const queryType = pipeable_1.pipe(parameters.serializedQueryParameter, fp_ts_1.option.map(query => `query: ${query.type};`), fp_ts_1.option.getOrElse(() => ''));
        const queryIO = pipeable_1.pipe(parameters.serializedQueryString, fp_ts_1.option.map(query => `const query = ${query.value};`), fp_ts_1.option.getOrElse(() => ''));
        const headersType = pipeable_1.pipe(parameters.serializedHeadersParameter, fp_ts_1.option.map(headers => `headers: ${headers.type};`), fp_ts_1.option.getOrElse(() => ''));
        const headersIO = pipeable_1.pipe(parameters.serializedHeadersParameter, fp_ts_1.option.map(headers => `const headers = ${headers.io}.encode(parameters.headers)`), fp_ts_1.option.getOrElse(() => ''));
        const argsType = array_1.concatIf(hasParameters, parameters.serializedPathParameters.map(p => p.type), [`parameters${hasParameters ? '' : '?'}: { ${queryType}${bodyType}${headersType} }`]).join(',');
        const argsTypeWithAccept = array_1.concatIf(true, parameters.serializedPathParameters.map(p => p.type), [`parameters${hasParameters ? '' : '?'}: { ${queryType}${bodyType}${headersType} accept: A; }`]).join(',');
        const type = pipeable_1.pipe(serializedResponses, fp_ts_1.either.fold(sr => `
							${utils_1.getJSDoc(fp_ts_1.array.compact([deprecated, operation.summary]))}
							readonly ${operationName}: (${argsType}) => ${utils_1.getKindValue(kind, sr.schema.type)};
						`, sr => `
							${utils_1.getJSDoc(fp_ts_1.array.compact([deprecated, operation.summary]))}
							${operationName}(${argsType}): ${utils_1.getKindValue(kind, `MapToResponse${operationName}['${sr[0].mediaType}']`)};
							${operationName}<A extends keyof MapToResponse${operationName}>(${argsTypeWithAccept}): ${utils_1.getKindValue(kind, `MapToResponse${operationName}[A]`)};`));
        const argsIO = array_1.concatIf(hasParameters, parameters.pathParameters.map(p => p.name), ['parameters']).join(',');
        const methodTypeIO = pipeable_1.pipe(serializedResponses, fp_ts_1.either.fold(() => `(${argsIO})`, () => `
							<A extends keyof MapToResponse${operationName}>(${argsTypeWithAccept}): ${utils_1.getKindValue(kind, `MapToResponse${operationName}[A]`)}`));
        const decode = pipeable_1.pipe(serializedResponses, fp_ts_1.either.fold(sr => `${sr.schema.io}.decode(value)`, () => `decode(accept, value)`));
        const acceptIO = pipeable_1.pipe(serializedResponses, fp_ts_1.either.fold(sr => `const accept = '${sr.mediaType}';`, sr => `const accept = (parameters && parameters.accept || '${sr[0].mediaType}') as A`));
        const mapToIO = pipeable_1.pipe(serializedResponses, fp_ts_1.either.fold(() => '', sr => {
            const rows = sr.map(s => `'${s.mediaType}': ${s.schema.io}`);
            return `const mapToIO = { ${rows.join()} };`;
        }));
        const decodeIO = pipeable_1.pipe(serializedResponses, fp_ts_1.either.fold(() => '', () => `const decode = <A extends keyof MapToResponse${operationName}>(a: A, b: unknown) =>
						(mapToIO[a].decode(b) as unknown) as Either<Errors, MapToResponse${operationName}[A]>;`));
        const requestHeaders = `{
					Accept: accept,
					${serializedContentType}
				}`;
        const io = `
					${operationName}: ${methodTypeIO} => {
						${bodyIO}
						${queryIO}
						${headersIO}
						${acceptIO}
						${mapToIO}
						${decodeIO}
						const responseType = getResponseTypeFromMediaType(accept);
						const requestHeaders = ${requestHeaders}

						return e.httpClient.chain(
							e.httpClient.request({
								url: ${utils_1.getURL(pattern, parameters.serializedPathParameters)},
								method: '${method}',
								responseType,
								${string_1.when(hasQueryParameters, 'query,')}
								${string_1.when(hasBodyParameter, 'body,')}
								headers: {${hasHeaderParameters ? '...headers,' : ''} ...requestHeaders}
							}),
							value =>
								pipe(
									${decode},
									either.mapLeft(ResponseValidationError.create),
									either.fold(error => e.httpClient.throwError(error), decoded => e.httpClient.of(decoded)),
								),
						);
					},
				`;
        const dependencies = [
            serialized_dependency_1.serializedDependency('getResponseTypeFromMediaType', '../utils/utils'),
            serialized_dependency_1.serializedDependency('ResponseValidationError', ref_1.getRelativePath(from, clientRef)),
            serialized_dependency_1.serializedDependency('pipe', 'fp-ts/lib/pipeable'),
            serialized_dependency_1.serializedDependency('either', 'fp-ts'),
            serialized_dependency_1.getSerializedKindDependency(kind),
            ...pipeable_1.pipe(serializedResponses, fp_ts_1.either.fold(s => s.schema.dependencies, function_1.flow(fp_ts_1.array.map(s => s.schema.dependencies), fp_ts_1.array.flatten, arr => [
                ...arr,
                serialized_dependency_1.serializedDependency('Errors', 'io-ts'),
                serialized_dependency_1.serializedDependency('Either', 'fp-ts/lib/Either'),
            ]))),
            ...fp_ts_1.array.flatten([
                ...parameters.serializedPathParameters.map(p => p.dependencies),
                ...fp_ts_1.array.compact([
                    pipeable_1.pipe(parameters.serializedQueryParameter, fp_ts_1.option.map(p => p.dependencies)),
                    pipeable_1.pipe(parameters.serializedBodyParameter, fp_ts_1.option.map(p => p.dependencies)),
                    pipeable_1.pipe(parameters.serializedQueryString, fp_ts_1.option.map(p => p.dependencies)),
                    pipeable_1.pipe(parameters.serializedHeadersParameter, fp_ts_1.option.map(p => p.dependencies)),
                ]),
            ]),
        ];
        const refs = fp_ts_1.array.flatten([
            ...parameters.serializedPathParameters.map(p => p.refs),
            ...fp_ts_1.array.compact([
                pipeable_1.pipe(parameters.serializedQueryParameter, fp_ts_1.option.map(p => p.refs)),
                pipeable_1.pipe(parameters.serializedBodyParameter, fp_ts_1.option.map(p => p.refs)),
                pipeable_1.pipe(parameters.serializedQueryString, fp_ts_1.option.map(p => p.refs)),
            ]),
        ]);
        return serialized_type_1.serializedType(type, io, dependencies, refs);
    });
});
