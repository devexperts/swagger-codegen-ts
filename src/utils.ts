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
import { Option, some } from 'fp-ts/lib/Option';

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

export const resolveParam = (parameters: Option<TParametersDefinitionsObject>) => (
	param: TParameterObject | TReferenceObject,
): Option<TParameterObject | TReferenceObject> => {
	if (!isOperationReferenceParameterObject(param)) {
		return some(param);
	}
	return last(param.$ref.split('/')).chain(ref => parameters.mapNullable(parameters => parameters[ref]));
};

export const addParamsToTag = (
	params: Array<TParameterObject | TReferenceObject>,
	parameters: Option<TParametersDefinitionsObject>,
) => (tag: TOperationObject): TOperationObject => ({
	...tag,
	parameters: tag.parameters
		.alt(some([]))
		.map(tagParameters =>
			[...tagParameters, ...params].map(params => resolveParam(parameters)(params).getOrElse(params)),
		)
		.map(uniq(paramSetoid)),
});

export const groupPathsByTag = (
	paths: TPathsObject,
	parameters: Option<TParametersDefinitionsObject>,
): TDictionary<TDictionary<TPathItemObject>> => {
	const keys = Object.keys(paths);
	const result: TDictionary<TDictionary<TPathItemObject>> = {};
	for (const key of keys) {
		const path = paths[key];
		const pathParams = path.parameters;
		const addParams = pathParams.map(pathParams => addParamsToTag(pathParams, parameters)).getOrElse(identity);
		const pathWithParams: TPathItemObject = pathParams
			.map(() => ({
				...path,
				get: path.get.map(addParams),
				post: path.post.map(addParams),
				put: path.put.map(addParams),
				delete: path.delete.map(addParams),
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
