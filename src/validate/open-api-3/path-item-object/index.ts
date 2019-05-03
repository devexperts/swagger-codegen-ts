import { Option } from 'fp-ts/lib/Option';
import { ServerObject, serverObjectIO } from '../server-object';
import { ParameterObject, parameterObjectIO } from '../parameter-object';
import { ReferenceObject, referenceObjectIO } from '../reference-object';
import { array, string, type, union } from 'io-ts';
import { OperationObject, operationObjectIO } from '../operation-object';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#pathItemObject
export type PathItemObject = {
	$ref: Option<string>;
	description: Option<string>;
	summary: Option<string>;
	parameters: Option<(ParameterObject | ReferenceObject)[]>;
	servers: Option<ServerObject[]>;

	get: Option<OperationObject>;
	put: Option<OperationObject>;
	post: Option<OperationObject>;
	delete: Option<OperationObject>;
	options: Option<OperationObject>;
	head: Option<OperationObject>;
	patch: Option<OperationObject>;
	trace: Option<OperationObject>;
};
export const pathItemObjectIO = type(
	{
		$ref: createOptionFromNullable(string, 'PathItemObject.$ref'),
		description: createOptionFromNullable(string, 'PathItemObject.description'),
		summary: createOptionFromNullable(string, 'PathItemObject.summary'),
		parameters: createOptionFromNullable(
			array(union([parameterObjectIO, referenceObjectIO])),
			'PathItemObject.parameters',
		),
		servers: createOptionFromNullable(array(serverObjectIO), 'PathItemObject.servers'),

		get: createOptionFromNullable(operationObjectIO, 'PathItemObject.get'),
		put: createOptionFromNullable(operationObjectIO, 'PathItemObject.put'),
		post: createOptionFromNullable(operationObjectIO, 'PathItemObject.post'),
		delete: createOptionFromNullable(operationObjectIO, 'PathItemObject.delete'),
		options: createOptionFromNullable(operationObjectIO, 'PathItemObject.options'),
		head: createOptionFromNullable(operationObjectIO, 'PathItemObject.head'),
		patch: createOptionFromNullable(operationObjectIO, 'PathItemObject.patch'),
		trace: createOptionFromNullable(operationObjectIO, 'PathItemObject.trace'),
	},
	'PathItemObject',
);
