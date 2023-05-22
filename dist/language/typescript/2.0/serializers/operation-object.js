"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_type_1 = require("../../common/data/serialized-type");
const pipeable_1 = require("fp-ts/lib/pipeable");
const Option_1 = require("fp-ts/lib/Option");
const responses_object_1 = require("./responses-object");
const serialized_parameter_1 = require("../../common/data/serialized-parameter");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const array_1 = require("../../../../utils/array");
const string_1 = require("../../../../utils/string");
const utils_1 = require("../../common/utils");
const Either_1 = require("fp-ts/lib/Either");
const fp_ts_1 = require("fp-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const ref_1 = require("../../../../utils/ref");
const client_1 = require("../../common/bundled/client");
const parameter_object_1 = require("../../../../schema/2.0/parameter-object");
const reference_object_1 = require("../../../../schema/2.0/reference-object");
const parameter_object_2 = require("./parameter-object");
const serialized_path_parameter_1 = require("../../common/data/serialized-path-parameter");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const Reader_1 = require("fp-ts/lib/Reader");
const schema_object_1 = require("./schema-object");
const Eq_1 = require("fp-ts/lib/Eq");
const serialized_fragment_1 = require("../../common/data/serialized-fragment");
const option_1 = require("../../../../utils/option");
const function_1 = require("fp-ts/lib/function");
const serialized_header_parameters_1 = require("../../common/data/serialized-header-parameters");
const contains = fp_ts_1.array.elem(Eq_1.getStructEq({
    name: Eq_1.eqString,
    in: Eq_1.eqString,
}));
const getParameters = reader_utils_1.combineReader(Reader_1.ask(), e => (from, operation, pathItem) => {
    const processedParameters = [];
    const pathParameters = [];
    const serializedPathParameters = [];
    const serializedQueryParameters = [];
    const bodyParameters = [];
    const serializedHeaderParameters = [];
    const formDataParameters = [];
    const queryStringFragments = [];
    const parameters = pipeable_1.pipe(
    // note that PathItem parameters should go after OperationObject parameters because they have lower priority
    // this means that OperationObject can override PathItemObject parameters
    [operation.parameters, pathItem.parameters], fp_ts_1.array.compact, fp_ts_1.array.flatten);
    for (const parameter of parameters) {
        const resolved = reference_object_1.ReferenceObjectCodec.is(parameter)
            ? pipeable_1.pipe(e.resolveRef(parameter.$ref, parameter_object_1.ParameterObjectCodec), fp_ts_1.either.mapLeft(() => new Error(`Unable to resolve parameter with $ref "${parameter.$ref}"`)))
            : Either_1.right(parameter);
        if (Either_1.isLeft(resolved)) {
            return resolved;
        }
        // if parameter has already been processed then skip it
        if (contains(resolved.right, processedParameters)) {
            continue;
        }
        processedParameters.push(resolved.right);
        const required = parameter_object_2.isRequired(resolved.right);
        const serialized = reference_object_1.ReferenceObjectCodec.is(parameter)
            ? pipeable_1.pipe(ref_1.fromString(parameter.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)), fp_ts_1.either.map(serialized_parameter_1.fromSerializedType(required)))
            : parameter_object_2.serializeParameterObject(from, resolved.right);
        if (Either_1.isLeft(serialized)) {
            return serialized;
        }
        switch (resolved.right.in) {
            case 'body': {
                bodyParameters.push(resolved.right);
                break;
            }
            case 'header': {
                const serializedParameter = pipeable_1.pipe(serialized.right, serialized_header_parameters_1.fromSerializedHeaderParameter(resolved.right.name), serialized_header_parameters_1.getSerializedHeaderParameterType);
                serializedHeaderParameters.push(serializedParameter);
                break;
            }
            case 'formData': {
                formDataParameters.push(resolved.right);
                break;
            }
            case 'path': {
                pathParameters.push(resolved.right);
                const serializedParameter = pipeable_1.pipe(serialized.right, serialized_path_parameter_1.fromSerializedParameter(resolved.right.name), serialized_path_parameter_1.getSerializedPathParameterType);
                serializedPathParameters.push(serializedParameter);
                break;
            }
            case 'query': {
                const serializedParameter = serialized_type_1.getSerializedOptionalType(required, serialized.right);
                const queryStringFragment = exports.serializeQueryParameterObject(from, resolved.right, serializedParameter, 'parameters.query');
                if (Either_1.isLeft(queryStringFragment)) {
                    return queryStringFragment;
                }
                queryStringFragments.push(queryStringFragment.right);
                serializedQueryParameters.push(serialized_type_1.getSerializedPropertyType(resolved.right.name, true, serializedParameter));
                break;
            }
        }
    }
    const serializedQueryParameter = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(serializedQueryParameters), fp_ts_1.option.map(parameters => pipeable_1.pipe(serialized_type_1.intercalateSerializedTypes(serialized_type_1.serializedType(';', ',', [], []), parameters), serialized_type_1.getSerializedObjectType())));
    // according to spec there can be only one body parameter
    const serializedBodyParameter = pipeable_1.pipe(fp_ts_1.array.head(bodyParameters), fp_ts_1.option.map(parameter => {
        const required = parameter_object_2.isRequired(parameter);
        return pipeable_1.pipe(schema_object_1.serializeSchemaObject(from, parameter.schema), fp_ts_1.either.map(serialized => serialized_type_1.getSerializedOptionalType(required, serialized)));
    }), option_1.sequenceOptionEither);
    const serializedHeadersParameter = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(serializedHeaderParameters), fp_ts_1.option.map(parameters => pipeable_1.pipe(serialized_type_1.intercalateSerializedTypes(serialized_type_1.serializedType(';', ',', [], []), parameters), serialized_type_1.getSerializedObjectType())));
    const queryString = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(queryStringFragments), fp_ts_1.option.map(queryStringFragments => serialized_fragment_1.intercalateSerializedFragmentsNEA(serialized_fragment_1.serializedFragment(',', [], []), queryStringFragments)), fp_ts_1.option.map(f => serialized_fragment_1.combineFragmentsK(f, c => serialized_fragment_1.serializedFragment(`compact([${c}]).join('&')`, [serialized_dependency_1.serializedDependency('compact', 'fp-ts/lib/Array')], []))));
    return either_utils_1.combineEither(serializedBodyParameter, serializedBodyParameter => ({
        pathParameters,
        serializedPathParameters,
        serializedQueryParameter,
        serializedBodyParameter,
        serializedHeadersParameter,
        formDataParameters,
        queryString,
    }));
});
exports.serializeOperationObject = reader_utils_1.combineReader(getParameters, getParameters => (from, url, method, kind, operation, pathItem) => {
    const parameters = getParameters(from, operation, pathItem);
    const operationName = getOperationName(url, operation, method);
    const isSuccessResponse = (code) => {
        const status = parseInt(code, 10);
        return status >= 200 && status < 300;
    };
    const serializedResponses = responses_object_1.serializeOperationResponses(from, pipeable_1.pipe(operation.responses, fp_ts_1.record.filterWithIndex(isSuccessResponse)));
    const deprecated = pipeable_1.pipe(operation.deprecated, fp_ts_1.option.filter(function_1.identity), Option_1.map(() => `@deprecated`));
    const responseType = pipeable_1.pipe(operation.produces, Option_1.fold(() => 'json', produces => {
        if (produces.includes('application/octet-stream')) {
            return 'blob';
        }
        if (produces.includes('text/plain')) {
            return 'text';
        }
        return 'json';
    }));
    return either_utils_1.combineEither(parameters, serializedResponses, client_1.clientRef, (parameters, serializedResponses, clientRef) => {
        const hasQueryParameters = Option_1.isSome(parameters.serializedQueryParameter);
        const hasBodyParameters = Option_1.isSome(parameters.serializedBodyParameter);
        const hasHeaderParameters = Option_1.isSome(parameters.serializedHeadersParameter);
        const hasParameters = hasQueryParameters || hasBodyParameters || hasHeaderParameters;
        const bodyType = pipeable_1.pipe(parameters.serializedBodyParameter, fp_ts_1.option.map(body => `body: ${body.type},`), fp_ts_1.option.getOrElse(() => ''));
        const bodyIO = pipeable_1.pipe(parameters.serializedBodyParameter, fp_ts_1.option.map(body => `const body = ${body.io}.encode(parameters.body);`), fp_ts_1.option.getOrElse(() => ''));
        const queryType = pipeable_1.pipe(parameters.serializedQueryParameter, fp_ts_1.option.map(query => `query: ${query.type},`), fp_ts_1.option.getOrElse(() => ''));
        const queryIO = pipeable_1.pipe(parameters.queryString, fp_ts_1.option.map(query => `const query = ${query.value};`), fp_ts_1.option.getOrElse(() => ''));
        const headersType = pipeable_1.pipe(parameters.serializedHeadersParameter, fp_ts_1.option.map(headers => `headers: ${headers.type}`), fp_ts_1.option.getOrElse(() => ''));
        const headersIO = pipeable_1.pipe(parameters.serializedHeadersParameter, fp_ts_1.option.map(headers => `const headers = ${headers.io}.encode(parameters.headers)`), fp_ts_1.option.getOrElse(() => ''));
        const argsType = array_1.concatIf(hasParameters, parameters.serializedPathParameters.map(p => p.type), [`parameters: { ${queryType}${bodyType}${headersType} }`]).join(',');
        const type = `
					${utils_1.getJSDoc(fp_ts_1.array.compact([deprecated, operation.summary]))}
					readonly ${operationName}: (${argsType}) => ${utils_1.getKindValue(kind, serializedResponses.type)};
				`;
        const argsIO = array_1.concatIf(hasParameters, parameters.pathParameters.map(p => p.name), ['parameters']).join(',');
        const io = `
					${operationName}: (${argsIO}) => {
						${bodyIO}
						${queryIO}
						${headersIO}

						return e.httpClient.chain(
							e.httpClient.request({
								url: ${utils_1.getURL(url, parameters.serializedPathParameters)},
								method: '${method}',
								responseType: '${responseType}',
								${string_1.when(hasQueryParameters, 'query,')}
								${string_1.when(hasBodyParameters, 'body,')}
								${string_1.when(hasHeaderParameters, 'headers')}
							}),
							value =>
								pipe(
									${serializedResponses.io}.decode(value),
									either.mapLeft(ResponseValidationError.create),
									either.fold(error => e.httpClient.throwError(error), decoded => e.httpClient.of(decoded)),
							),
						);
					},
				`;
        const dependencies = [
            serialized_dependency_1.serializedDependency('ResponseValidationError', ref_1.getRelativePath(from, clientRef)),
            serialized_dependency_1.serializedDependency('pipe', 'fp-ts/lib/pipeable'),
            serialized_dependency_1.serializedDependency('either', 'fp-ts'),
            serialized_dependency_1.getSerializedKindDependency(kind),
            ...serializedResponses.dependencies,
            ...fp_ts_1.array.flatten([
                ...parameters.serializedPathParameters.map(p => p.dependencies),
                ...fp_ts_1.array.compact([
                    pipeable_1.pipe(parameters.serializedQueryParameter, fp_ts_1.option.map(p => p.dependencies)),
                    pipeable_1.pipe(parameters.serializedBodyParameter, fp_ts_1.option.map(p => p.dependencies)),
                    pipeable_1.pipe(parameters.queryString, fp_ts_1.option.map(p => p.dependencies)),
                    pipeable_1.pipe(parameters.serializedHeadersParameter, fp_ts_1.option.map(p => p.dependencies)),
                ]),
            ]),
        ];
        const refs = fp_ts_1.array.flatten([
            ...parameters.serializedPathParameters.map(p => p.refs),
            ...fp_ts_1.array.compact([
                pipeable_1.pipe(parameters.serializedQueryParameter, fp_ts_1.option.map(p => p.refs)),
                pipeable_1.pipe(parameters.serializedBodyParameter, fp_ts_1.option.map(p => p.refs)),
                pipeable_1.pipe(parameters.queryString, fp_ts_1.option.map(p => p.refs)),
            ]),
            ...parameters.serializedPathParameters.map(p => p.refs),
        ]);
        return serialized_type_1.serializedType(type, io, dependencies, refs);
    });
});
const getOperationName = (url, operation, httpMethod) => pipeable_1.pipe(operation.operationId, Option_1.getOrElse(() => `${httpMethod}_${utils_1.getSafePropertyName(url)}`));
exports.getCollectionSeparator = (format) => {
    switch (format) {
        case 'csv': {
            return ',';
        }
        case 'ssv': {
            return ' ';
        }
        case 'tsv': {
            return '\t';
        }
        case 'pipes': {
            return '|';
        }
    }
};
exports.serializeQueryParameterObject = (from, parameter, serialized, target) => {
    const required = parameter_object_2.isRequired(parameter);
    const encoded = serialized_fragment_1.serializedFragment(`${serialized.io}.encode(${target}.${parameter.name})`, serialized.dependencies, serialized.refs);
    switch (parameter.type) {
        case 'string':
        case 'integer':
        case 'number':
        case 'boolean': {
            const f = serialized_fragment_1.serializedFragment(`value => some(encodeURIComponent('${parameter.name}') + '=' + encodeURIComponent(value))`, [serialized_dependency_1.serializedDependency('some', 'fp-ts/lib/Option')], []);
            return Either_1.right(serialized_fragment_1.getSerializedOptionCallFragment(!required, f, encoded));
        }
        case 'array': {
            const collectionFormat = pipeable_1.pipe(parameter.collectionFormat, fp_ts_1.option.getOrElse(() => 'csv'));
            switch (collectionFormat) {
                case 'csv':
                case 'ssv':
                case 'tsv':
                case 'pipes': {
                    const s = exports.getCollectionSeparator(collectionFormat);
                    const f = serialized_fragment_1.serializedFragment(`value => some(encodeURIComponent('${parameter.name}') + '=' + encodeURIComponent(value.join('${s}')))`, [serialized_dependency_1.serializedDependency('some', 'fp-ts/lib/Option')], []);
                    return Either_1.right(serialized_fragment_1.getSerializedOptionCallFragment(!required, f, encoded));
                }
                case 'multi': {
                    const f = serialized_fragment_1.serializedFragment(`value => some(value.map(item => encodeURIComponent('${parameter.name}') + '=' + encodeURIComponent(item)).join('&'))`, [serialized_dependency_1.serializedDependency('some', 'fp-ts/lib/Option')], []);
                    return Either_1.right(serialized_fragment_1.getSerializedOptionCallFragment(!required, f, encoded));
                }
            }
            return Either_1.left(new Error('Invalid ArrayQueryParameterObject'));
        }
    }
};
