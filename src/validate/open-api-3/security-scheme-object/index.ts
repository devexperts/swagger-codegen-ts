import { Option } from 'fp-ts/lib/Option';
import { OAuthFlowsObject, oauthFlowsObjectIO } from '../oauth-flows-object';
import { string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#securitySchemeObject
export type SecuritySchemeObject = {
	type: string;
	description: Option<string>;
	name: string;
	in: string;
	scheme: string;
	bearerFormat: Option<string>;
	flows: OAuthFlowsObject;
	openIdConnectUrl: string;
};
export const securityShemeObjectIO = type(
	{
		type: string,
		description: createOptionFromNullable(string),
		name: string,
		in: string,
		scheme: string,
		bearerFormat: createOptionFromNullable(string),
		flows: oauthFlowsObjectIO,
		openIdConnectUrl: string,
	},
	'SecuritySchemeObject',
);
