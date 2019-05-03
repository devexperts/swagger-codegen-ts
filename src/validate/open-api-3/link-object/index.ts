import { Option } from 'fp-ts/lib/Option';
import { ServerObject, serverObjectIO } from '../server-object';
import { record, string, type, unknown } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#linkObject
export type LinkObject = {
	operationRef: Option<string>;
	operationId: Option<string>;
	parameters: Option<Record<string, unknown>>;
	requestBody: Option<unknown>;
	description: Option<string>;
	server: Option<ServerObject>;
};
export const linkObjectIO = type(
	{
		operationRef: createOptionFromNullable(string),
		operationId: createOptionFromNullable(string),
		parameters: createOptionFromNullable(record(string, unknown)),
		requestBody: createOptionFromNullable(unknown),
		description: createOptionFromNullable(string),
		server: createOptionFromNullable(serverObjectIO),
	},
	'LinkObject',
);
