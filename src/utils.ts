import { array, uniq, flatten, last } from 'fp-ts/lib/Array';
import {
	TPathItemObject,
	TOperationObject,
	TPathsObject,
	TDictionary,
	TParameterObject,
	TPathParameterObject,
	TReferenceObject,
	TBodyParameterObject,
	TSwaggerObject,
	TParametersDefinitionsObject,
} from './swagger';
import { identity, tuple } from 'fp-ts/lib/function';
import { getRecordSetoid, setoidString } from 'fp-ts/lib/Setoid';
import { TQueryParameterObject } from './swagger';
import { TFSEntity } from './fs';
import { camelize } from '@devexperts/utils/dist/string/string';
import { option, Option, some } from 'fp-ts/lib/Option';
import { sequence } from 'fp-ts/lib/Traversable';

export type TSerializer = (name: string, schema: TSwaggerObject) => TFSEntity;

export const getOperationsFromPath = (path: TPathItemObject): TDictionary<TOperationObject> => {
	const result: TDictionary<TOperationObject> = {};
	const operations = array.compact([
		path.get.map(operation => tuple('get', operation)),
		path.post.map(operation => tuple('post', operation)),
		path.put.map(operation => tuple('put', operation)),
		path.delete.map(operation => tuple('delete', operation)),
		path.head.map(operation => tuple('head', operation)),
		path.options.map(operation => tuple('options', operation)),
		path.patch.map(operation => tuple('patch', operation)),
	]);
	for (const [name, operation] of operations) {
		result[name] = operation;
	}
	return result;
};

export const getTagsFromPath = (path: TPathItemObject): string[] => {
	const operations = getOperationsFromPath(path);
	const tags = flatten(array.compact(Object.keys(operations).map(key => operations[key].tags)));
	return uniq(setoidString)(tags);
};

const paramSetoid = getRecordSetoid<TParameterObject | TReferenceObject>({
	name: setoidString,
	$ref: setoidString,
});

const addPathParametersToTag = (pathParams: Array<TParameterObject | TReferenceObject>) => (
	tagParams: Array<TParameterObject | TReferenceObject>,
): Array<TParameterObject | TReferenceObject> => uniq(paramSetoid)([...pathParams, ...tagParams]);

const resolveTagParameter = (fileParameters: TParametersDefinitionsObject) => (
	parameter: TParameterObject | TReferenceObject,
): Option<TParameterObject> => {
	if (!isOperationReferenceParameterObject(parameter)) {
		return some(parameter);
	}
	return last(parameter.$ref.split('/')).mapNullable(ref => fileParameters[ref]);
};

const getTagWithResolvedParameters = (
	addPathParametersToTag: (
		tagParams: Array<TParameterObject | TReferenceObject>,
	) => Array<TParameterObject | TReferenceObject>,
	resolveTagParameter: (parameter: TParameterObject | TReferenceObject) => Option<TParameterObject>,
) => (tag: TOperationObject): TOperationObject => ({
	...tag,
	parameters: tag.parameters
		.alt(some([]))
		.map(addPathParametersToTag)
		.map(parameters => parameters.map(resolveTagParameter))
		.chain(sequence(option, array)),
});

export const groupPathsByTag = (
	paths: TPathsObject,
	parameters: Option<TParametersDefinitionsObject>,
): TDictionary<TDictionary<TPathItemObject>> => {
	const keys = Object.keys(paths);
	const result: TDictionary<TDictionary<TPathItemObject>> = {};
	const resolveTagParam = parameters.map(resolveTagParameter);
	for (const key of keys) {
		const path = paths[key];
		const pathParams = path.parameters;
		const addPathParamsToTag = pathParams.map(addPathParametersToTag);
		const processTag = addPathParamsToTag
			.chain(addPathParamsToTag =>
				resolveTagParam.map(resolveTagParam =>
					getTagWithResolvedParameters(addPathParamsToTag, resolveTagParam),
				),
			)
			.getOrElse(identity);
		const pathWithParams: TPathItemObject = pathParams
			.map(() => ({
				...path,
				get: path.get.map(processTag),
				post: path.post.map(processTag),
				put: path.put.map(processTag),
				delete: path.delete.map(processTag),
			}))
			.getOrElse(path);
		const tags = getTagsFromPath(pathWithParams);
		const tag = camelize(tags.join('').replace(/\s/g, ''), false);

		result[tag] = {
			...(result[tag] || {}),
			[key]: pathWithParams,
		};
	}
	return result;
};

const isOperationReferenceParameterObject = (
	parameter: TParameterObject | TReferenceObject,
): parameter is TReferenceObject => typeof (parameter as any)['$ref'] === 'string';
const isOperationNonReferenceParameterObject = (
	parameter: TParameterObject | TReferenceObject,
): parameter is TParameterObject => !isOperationReferenceParameterObject(parameter);

const isPathParameterObject = (parameter: TParameterObject): parameter is TPathParameterObject =>
	parameter.in === 'path';
const isOperationPathParameterObject = (
	parameter: TParameterObject | TReferenceObject,
): parameter is TPathParameterObject =>
	isOperationNonReferenceParameterObject(parameter) && isPathParameterObject(parameter);
export const getOperationParametersInPath = (operation: TOperationObject): TPathParameterObject[] =>
	operation.parameters.map(parameters => parameters.filter(isOperationPathParameterObject)).getOrElse([]);

const isQueryParameterObject = (parameter: TParameterObject): parameter is TQueryParameterObject =>
	parameter.in === 'query';
const isOperationQueryParameterObject = (
	parameter: TParameterObject | TReferenceObject,
): parameter is TQueryParameterObject =>
	isOperationNonReferenceParameterObject(parameter) && isQueryParameterObject(parameter);
export const getOperationParametersInQuery = (operation: TOperationObject): TQueryParameterObject[] =>
	operation.parameters.map(parameters => parameters.filter(isOperationQueryParameterObject)).getOrElse([]);

const isBodyParameterObject = (parameter: TParameterObject): parameter is TBodyParameterObject =>
	parameter.in === 'body';
const isOperationBodyParameterObject = (
	parameter: TParameterObject | TReferenceObject,
): parameter is TBodyParameterObject =>
	isOperationNonReferenceParameterObject(parameter) && isBodyParameterObject(parameter);
export const getOperationParametersInBody = (operation: TOperationObject): TBodyParameterObject[] =>
	operation.parameters.map(parameters => parameters.filter(isOperationBodyParameterObject)).getOrElse([]);
