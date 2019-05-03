import { Option } from 'fp-ts/lib/Option';
import { record, string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#oauthFlowObject
export type OAuthFlowObject = {
	authorizationUrl: string;
	tokenUrl: string;
	refreshUrl: Option<string>;
	scopes: Record<string, string>;
};
export const oauthFlowObjectIO = type(
	{
		authorizationUrl: string,
		tokenUrl: string,
		refreshUrl: createOptionFromNullable(string),
		scopes: record(string, string),
	},
	'OAuthFlowObject',
);
