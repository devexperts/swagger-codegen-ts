import {
	TDictionary,
	TPathItemObject,
	TPathsObject,
	TOperationObject,
	TPathParameterObject,
	TItemsObject,
} from './swagger';
import {
	TBooleanPropertySchemaObject,
	TNumberPropertySchemaObject,
	TIntegerPropertySchemaObject,
	TStringPropertySchemaObject,
} from './swagger';
import {
	TSwaggerObject,
	TDefinitionsObject,
	TSchemaObject,
	TNonArrayItemsObject,
	TQueryParameterObject,
} from './swagger';
import {
	groupPathsByTag,
	getOperationsFromPath,
	getOperationParametersInPath,
	getOperationParametersInQuery,
} from './utils';
import { camelize } from '@devexperts/utils/dist/string/string';
import { some, Option, none } from 'fp-ts/lib/Option';
import { array } from 'fp-ts/lib/Array';

export const serializeSwaggerObject = (swaggerObject: TSwaggerObject): string => `
	/*
	 * ${swaggerObject.info.title}
	 */
	${swaggerObject.definitions.map(serializeDefinitions).toUndefined()}
	${serializePaths(swaggerObject.paths)}
`;

const serializeSchemaObjectType = (schema: TSchemaObject): string => {
	switch (schema.type) {
		case undefined: {
			return `${schema.$ref.replace(/^#\/definitions\//g, '')}`;
		}
		case 'string': {
			return schema.format.fold(schema.type, format => {
				// switch (format) {
				// 	case 'date':
				// 	case 'date-time': {
				// 		return 'Date';
				// 	}
				// }
				return schema.type;
			});
		}
		case 'boolean':
		case 'number': {
			return schema.type;
		}
		case 'integer': {
			return 'number';
		}
		case 'array': {
			return `${serializeSchemaObjectType(schema.items)}[]`;
		}
		case 'object': {
			return `{
				${schema.properties
					.map(properties =>
						serializeDictionary(properties, (name, value) =>
							serializeField(
								name,
								value,
								schema.required.map(required => required.includes(name)).getOrElse(false),
							),
						),
					)
					.toUndefined()}
			}`;
		}
	}
};

const serializeField = (name: string, schema: TSchemaObject, isRequired: boolean): string => {
	const type = serializeSchemaObjectType(schema);
	return isRequired ? `${name}: ${type};` : `${name}: Option<${type}>;`;
};

export const serializeSchemaObject = (name: string, schema: TSchemaObject): string =>
	`export type ${name} = ${serializeSchemaObjectType(schema)};`;

export const serializeDictionary = <A>(
	dictionary: TDictionary<A>,
	serializeValue: (name: string, value: A) => string,
): string =>
	Object.keys(dictionary)
		.map(name => serializeValue(name, dictionary[name]))
		.join('');

export const serializeDefinitions = (definitions: TDefinitionsObject): string => `
	export namespace Definitions {
		${serializeDictionary(definitions, serializeSchemaObject)}
	}
`;

export const serializePath = (name: string, path: TPathItemObject): string => `
	${serializeDictionary(getOperationsFromPath(path), serializeOperationObject(name))}
`;

const serializeNonArrayItemsObjectType = (items: TNonArrayItemsObject): string => {
	switch (items.type) {
		case 'string':
		case 'boolean':
		case 'number': {
			return items.type;
		}
		case 'integer': {
			return 'number';
		}
	}
};

const serializePathParameterType = (parameter: TPathParameterObject): string => {
	switch (parameter.type) {
		case 'string': {
			return parameter.format.fold(parameter.type, format => {
				// switch (format) {
				// 	case 'date':
				// 	case 'date-time': {
				// 		return 'Date';
				// 	}
				// }
				return parameter.type;
			});
		}
		case 'boolean':
		case 'number': {
			return parameter.type;
		}
		case 'integer': {
			return 'number';
		}
		case 'array': {
			return serializeNonArrayItemsObjectType(parameter.items);
		}
	}
};
const serializePathParameter = (parameter: TPathParameterObject): string =>
	`${camelize(parameter.name)}: ${serializePathParameterType(parameter)}`;
const serializePathParameters = (parameters: TPathParameterObject[]): string =>
	parameters.map(serializePathParameter).join(', ');

const serializePathParameterDescription = (parameter: TPathParameterObject): string =>
	`@param {${serializePathParameterType(parameter)}} ${camelize(parameter.name)} ${parameter.description
		.map(d => '- ' + d)
		.toUndefined()}`;

const serializeMethod = (method: string): Option<string> => {
	switch (method) {
		case 'get': {
			return some('ApiClient.Method.Get');
		}
		case 'post': {
			return some('ApiClient.Method.Post');
		}
		case 'put': {
			return some('ApiClient.Method.Put');
		}
		case 'delete': {
			return some('ApiClient.Method.Delete');
		}
	}
	return none;
};

const serializeQueryParametersAsArgument = (parameters: TQueryParameterObject[]): string => {
	if (parameters.some(p => p.required.isSome() && p.required.value)) {
		return `query: {}`;
	} else {
		return `query?: {} = {}`;
	}
};

const serializeOperationObject = (path: string) => (method: string, operation: TOperationObject): string => {
	const parametersInPath = getOperationParametersInPath(operation);
	const paramsSummary = parametersInPath.map(serializePathParameterDescription);
	const serializedParams = serializePathParameters(parametersInPath);
	const methodName = operation.operationId.map(camelize).getOrElse(method);
	const lines = array.compact([operation.summary, ...paramsSummary.map(some)]);
	const parametersInQuery = getOperationParametersInQuery(operation);
	const serializedQuery = serializeQueryParametersAsArgument(parametersInQuery);

	const serializedMethod = serializeMethod(method);
	const methodBody = serializedMethod.fold(
		`
			return of(failure(new Error('Unknown method: ${method}')));
		`,
		method => {
			const url = parametersInPath.reduce(
				(acc, p) => acc.replace(`{${p.name}}`, `\$\{${camelize(p.name)}\}`),
				`\`${path}\``,
			);
			return `
				const url = ${url};
				const request: AjaxRequest = {
					url,
					method: '${method}'
				}
			`;
		},
	);
	return `
		/**
		 ${lines.map(line => `* ${line}`).join('\n')}
		 */
		export const ${methodName} = (${serializedParams}, ${serializedQuery}): LiveData<any> => {
			${methodBody}
		}
	`;
};

const serializePathGroup = (name: string, group: TDictionary<TPathItemObject>): string => `
	export namespace ${name}API {
		${serializeDictionary(group, serializePath)}
	}
`;

export const serializePaths = (paths: TPathsObject): string => {
	const groupped = groupPathsByTag(paths);
	return `
		export namespace API {
			${serializeDictionary(groupped, serializePathGroup)}
		}
	`;
};
