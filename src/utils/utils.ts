import { array, uniq, flatten, last } from 'fp-ts/lib/Array';
import { constant, Endomorphism, identity, tuple } from 'fp-ts/lib/function';
import { getStructEq, eqString } from 'fp-ts/lib/Eq';
import { FSEntity } from './fs';
import { alt, map, mapNullable, option, Option, some, chain, getOrElse } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { SwaggerObject } from '../schema/2.0/swagger-object';
import { Dictionary } from './types';
import { Reference, ReferenceObject } from '../schema/2.0/reference-object';
import { QueryParameterObject } from '../schema/2.0/parameter-object/query-parameter-object/query-parameter-object';
import { PathParameterObject } from '../schema/2.0/parameter-object/path-parameter-object/path-parameter-object';
import { BodyParameterObject } from '../schema/2.0/parameter-object/body-parameter-object';
import { ParameterObject } from '../schema/2.0/parameter-object/parameter-object';
import { OperationObject } from '../schema/2.0/operation-object';
import { PathItemObject } from '../schema/2.0/path-item-object';
import { PathsObject } from '../schema/2.0/paths-object';
import { ParametersDefinitionsObject } from '../schema/2.0/parameters-definitions-object';

export interface Serializer {
	(name: string, schema: SwaggerObject): FSEntity;
}

export const getOperationsFromPath = (path: PathItemObject): Dictionary<OperationObject> => {
	const result: Record<string, OperationObject> = {};
	const operations = array.compact([
		pipe(
			path.get,
			map(operation => tuple('get', operation)),
		),
		pipe(
			path.post,
			map(operation => tuple('post', operation)),
		),
		pipe(
			path.put,
			map(operation => tuple('put', operation)),
		),
		pipe(
			path.delete,
			map(operation => tuple('delete', operation)),
		),
		pipe(
			path.head,
			map(operation => tuple('head', operation)),
		),
		pipe(
			path.options,
			map(operation => tuple('options', operation)),
		),
		pipe(
			path.patch,
			map(operation => tuple('patch', operation)),
		),
	]);
	for (const [name, operation] of operations) {
		result[name] = operation;
	}
	return result;
};

export const getTagsFromPath = (path: PathItemObject): string[] => {
	const operations = getOperationsFromPath(path);
	const tags = flatten(array.compact(Object.keys(operations).map(key => operations[key].tags)));
	return uniq(eqString)(tags);
};

type Parameter = Reference<ParameterObject>;
const paramSetoid = getStructEq<Parameter>({
	name: eqString,
	$ref: eqString,
});

const addPathParametersToTag = (pathParams: Parameter[]): Endomorphism<Parameter[]> => tagParams =>
	uniq(paramSetoid)([...pathParams, ...tagParams]);

const resolveTagParameter = (fileParameters: ParametersDefinitionsObject) => (
	parameter: Parameter,
): Option<ParameterObject> => {
	if (!isReferenceObject(parameter)) {
		return some(parameter);
	}
	return pipe(
		last(parameter.$ref.split('/')),
		mapNullable(ref => fileParameters[ref]),
	);
};

const getTagWithResolvedParameters = (
	addPathParametersToTag: Endomorphism<Parameter[]>,
	resolveTagParameter: (parameter: Parameter) => Option<ParameterObject>,
) => (tag: OperationObject): OperationObject => ({
	...tag,
	parameters: pipe(
		tag.parameters,
		alt<Parameter[]>(constant(some([]))),
		map(addPathParametersToTag),
		map(parameters => parameters.map(resolveTagParameter)),
		chain(array.sequence(option)),
	),
});

export const groupPathsByTag = (
	paths: PathsObject,
	parameters: Option<ParametersDefinitionsObject>,
): Dictionary<Dictionary<PathItemObject>> => {
	const keys = Object.keys(paths);
	const result: Record<string, Dictionary<PathItemObject>> = {};
	const resolveTagParam = pipe(
		parameters,
		map(resolveTagParameter),
	);
	for (const key of keys) {
		const path = paths[key];
		const pathParams = path.parameters;
		const addPathParamsToTag = pipe(
			pathParams,
			map(addPathParametersToTag),
		);
		const processTag = pipe(
			addPathParamsToTag,
			chain(addPathParamsToTag =>
				pipe(
					resolveTagParam,
					map(resolveTagParam => getTagWithResolvedParameters(addPathParamsToTag, resolveTagParam)),
				),
			),
			getOrElse<Endomorphism<OperationObject>>(() => identity),
		);
		const pathWithParams: PathItemObject = pipe(
			pathParams,
			map(() => ({
				...path,
				get: pipe(
					path.get,
					map(processTag),
				),
				post: pipe(
					path.post,
					map(processTag),
				),
				put: pipe(
					path.put,
					map(processTag),
				),
				delete: pipe(
					path.delete,
					map(processTag),
				),
			})),
			getOrElse(() => path),
		);
		const tags = getTagsFromPath(pathWithParams);
		const tag = tags.join('').replace(/\s/g, '');

		result[tag] = {
			...(result[tag] || {}),
			[key]: pathWithParams,
		};
	}
	return result;
};

const isReferenceObject = (parameter: unknown): parameter is ReferenceObject =>
	typeof (parameter as any)['$ref'] === 'string';
const isOperationNonReferenceParameterObject = (parameter: Parameter): parameter is ParameterObject =>
	!isReferenceObject(parameter);

const isPathParameterObject = (parameter: ParameterObject): parameter is PathParameterObject => parameter.in === 'path';
const isOperationPathParameterObject = (parameter: Parameter): parameter is PathParameterObject =>
	isOperationNonReferenceParameterObject(parameter) && isPathParameterObject(parameter);
export const getOperationParametersInPath = (operation: OperationObject): PathParameterObject[] =>
	pipe(
		operation.parameters,
		map(parameters => parameters.filter(isOperationPathParameterObject)),
		getOrElse(constant<PathParameterObject[]>([])),
	);

const isQueryParameterObject = (parameter: ParameterObject): parameter is QueryParameterObject =>
	parameter.in === 'query';
const isOperationQueryParameterObject = (parameter: Parameter): parameter is QueryParameterObject =>
	isOperationNonReferenceParameterObject(parameter) && isQueryParameterObject(parameter);
export const getOperationParametersInQuery = (operation: OperationObject): QueryParameterObject[] =>
	pipe(
		operation.parameters,
		map(parameters => parameters.filter(isOperationQueryParameterObject)),
		getOrElse(constant<QueryParameterObject[]>([])),
	);

const isBodyParameterObject = (parameter: ParameterObject): parameter is BodyParameterObject => parameter.in === 'body';
const isOperationBodyParameterObject = (parameter: Parameter): parameter is BodyParameterObject =>
	isOperationNonReferenceParameterObject(parameter) && isBodyParameterObject(parameter);
export const getOperationParametersInBody = (operation: OperationObject): BodyParameterObject[] =>
	pipe(
		operation.parameters,
		map(parameters => parameters.filter(isOperationBodyParameterObject)),
		getOrElse(constant<BodyParameterObject[]>([])),
	);
