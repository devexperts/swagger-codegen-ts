import { Option } from 'fp-ts/lib/Option';
import { OAuthFlowObject, oauthFlowObjectIO } from '../oauth-flow-object';
import { type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#oauthFlowsObject
export type OAuthFlowsObject = {
	implicit: Option<OAuthFlowObject>;
	password: Option<OAuthFlowObject>;
	clientCredentials: Option<OAuthFlowObject>;
	authorizationCode: Option<OAuthFlowObject>;
};
export const oauthFlowsObjectIO = type(
	{
		implicit: createOptionFromNullable(oauthFlowObjectIO),
		password: createOptionFromNullable(oauthFlowObjectIO),
		clientCredentials: createOptionFromNullable(oauthFlowObjectIO),
		authorizationCode: createOptionFromNullable(oauthFlowObjectIO),
	},
	'OAuthFlowsObject',
);
