import { TDictionary, TPathItemObject, TPathsObject, TOperationObject, TPathParameterObject } from './swagger';
import {
	TBooleanPropertySchemaObject,
	TNumberPropertySchemaObject,
	TIntegerPropertySchemaObject,
	TStringPropertySchemaObject,
} from './swagger';
import { TSwaggerObject, TDefinitionsObject, TSchemaObject } from './swagger';
import { groupPathsByTag, getOperationsFromPath, getOperationParametersInPath } from './utils';
import { camelize } from '@devexperts/utils/dist/string/string';

export const serializeSwaggerObject = (swaggerObject: TSwaggerObject): string => `
	/*
	 * ${swaggerObject.info.title}
	 */
	${swaggerObject.definitions.map(serializeDefinitions).toUndefined()}
	${serializePaths(swaggerObject.paths)}
`;

const serializeType = (schema: TSchemaObject): string => {
	switch (schema.type) {
		case undefined: {
			return `${schema.$ref.replace(/^#\/definitions\//g, '')}`;
		}
		case 'boolean':
		case 'number':
		case 'string': {
			return schema.type;
		}
		case 'integer': {
			return 'number';
		}
		case 'array': {
			return `${serializeType(schema.items)}[]`;
		}
		case 'object': {
			return `{
				${schema.properties
					.map(properties =>
						Object.keys(properties)
							.map(key =>
								serializeField(
									key,
									properties[key],
									schema.required.map(required => required.includes(key)).getOrElse(false),
								),
							)
							.join(''),
					)
					.toUndefined()}
			}`;
		}
	}
};

const serializeField = (name: string, schema: TSchemaObject, isRequired: boolean): string => {
	const type = serializeType(schema);
	return isRequired ? `${name}: ${type};` : `${name}: Option<${type}>;`;
};

export const serializeSchemaObject = (name: string, schema: TSchemaObject): string =>
	`export type ${name} = ${serializeType(schema)};`;

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

const serializePathParameter = (parameter: TPathParameterObject): string => `${camelize(parameter.name, true)}: string`;
const serializePathParameters = (parameters: TPathParameterObject[]): string =>
	parameters.map(serializePathParameter).join(', ');

const serializeOperationObject = (path: string) => (method: string, operation: TOperationObject): string => {
	const parametersInPath = getOperationParametersInPath(operation);
	const summary = parametersInPath.map(parameter => `@param {}`);
	return `
		/**
		 * ${operation.summary.toUndefined()}
		 * ${path}
		 */
		export const ${operation.operationId.getOrElse(method)} = (${serializePathParameters(parametersInPath)}) => {}
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
