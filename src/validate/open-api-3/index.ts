import { Option } from 'fp-ts/lib/Option';
import { Any, array, recursion, RecursiveType, string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';
import { ComponentsObject, componentsObjectIO } from './components-object';
import { InfoObject, infoObjectIO } from './info-object';
import { ServerObject, serverObjectIO } from './server-object';
import { pathsObjectIO, PathsObject } from './paths-object';
import { TagObject, tagObjectIO } from './tag-object';
import { ExternalDocumentationObject, externalDocumentationObjectIO } from './external-documentation-object';
import { SecurityRequirementObject, securityRequirementObjectIO } from './security-requirement-object';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#oasObject
export type OpenAPI = {
	components: Option<ComponentsObject>;
	externalDocs: Option<ExternalDocumentationObject>;
	info: InfoObject;
	openapi: string;
	paths: PathsObject;
	security: Option<SecurityRequirementObject[]>;
	servers: Option<ServerObject[]>;
	tags: Option<TagObject[]>;
};

export const openAPIIO: RecursiveType<Any, OpenAPI, unknown> = recursion('OpenAPI', () =>
	type({
		components: createOptionFromNullable(componentsObjectIO),
		externalDocs: createOptionFromNullable(externalDocumentationObjectIO),
		info: infoObjectIO,
		openapi: string,
		paths: pathsObjectIO,
		security: createOptionFromNullable(array(securityRequirementObjectIO)),
		servers: createOptionFromNullable(array(serverObjectIO)),
		tags: createOptionFromNullable(array(tagObjectIO)),
	}),
);
