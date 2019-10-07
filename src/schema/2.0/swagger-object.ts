import * as t from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { Option } from 'fp-ts/lib/Option';
import { stringArrayOption, stringOption } from '../../utils/io-ts';
import { InfoObject } from './info-object';
import { ExternalDocumentationObject } from './external-documentation-object';
import { SecurityRequirementObject } from './security-requirement-object';
import { TagObject } from './tag-object';
import { ResponsesDefinitionsObject } from './responses-definitions-object';
import { SecurityDefinitionsObject } from './security-definitions-object';
import { DefinitionsObject } from './definitions-object';
import { PathsObject } from './paths-object';
import { ParametersDefinitionsObject } from './parameters-definitions-object';

export interface SwaggerObject {
	readonly basePath: Option<string>;
	readonly consumes: Option<string[]>;
	readonly definitions: Option<DefinitionsObject>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
	readonly host: Option<string>;
	readonly info: InfoObject;
	readonly parameters: Option<ParametersDefinitionsObject>;
	readonly paths: PathsObject;
	readonly produces: Option<string[]>;
	readonly responses: Option<ResponsesDefinitionsObject>;
	readonly schemes: Option<string[]>;
	readonly security: Option<SecurityRequirementObject[]>;
	readonly securityDefinitions: Option<SecurityDefinitionsObject>;
	readonly swagger: string;
	readonly tags: Option<TagObject[]>;
}

export const SwaggerObject = t.type(
	{
		basePath: stringOption,
		consumes: stringArrayOption,
		definitions: optionFromNullable(DefinitionsObject),
		externalDocs: optionFromNullable(ExternalDocumentationObject),
		host: stringOption,
		info: InfoObject,
		parameters: optionFromNullable(ParametersDefinitionsObject),
		paths: PathsObject,
		produces: stringArrayOption,
		responses: optionFromNullable(ResponsesDefinitionsObject),
		schemes: stringArrayOption,
		security: optionFromNullable(t.array(SecurityRequirementObject)),
		securityDefinitions: optionFromNullable(SecurityDefinitionsObject),
		swagger: t.string,
		tags: optionFromNullable(t.array(TagObject)),
	},
	'SwaggerObject',
);
