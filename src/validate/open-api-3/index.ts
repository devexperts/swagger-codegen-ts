import { Option } from 'fp-ts/lib/Option';
import { array, string, type, unknown } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';
import { ComponentsObject, componentsObjectIO } from './components-object';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#oasObject
export type OpenAPI = {
	components: Option<ComponentsObject>;
	externalDocs: Option<object>; // TODO
	info: unknown; // TODO
	openapi: string;
	paths: unknown; // TODO
	security: Option<unknown[]>; // TODO
	servers: Option<unknown[]>; // TODO
	tags: Option<unknown>; // TODO
};

export const openAPIIO = type(
	{
		components: createOptionFromNullable(componentsObjectIO),
		externalDocs: createOptionFromNullable(unknown), // TODO
		info: unknown, // TODO
		openapi: string,
		paths: unknown, // TODO
		security: createOptionFromNullable(array(unknown)), // TODO
		servers: createOptionFromNullable(array(unknown)), // TODO
		tags: createOptionFromNullable(unknown), // TODO
	},
	'OpenAPI',
);
