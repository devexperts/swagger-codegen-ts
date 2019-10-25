import { Option } from 'fp-ts/lib/Option';
import { ExternalDocumentationObject } from './external-documentation-object';
import { ParameterObject } from './parameter-object/parameter-object';
import { ReferenceObject } from './reference-object';
import { ResponsesObject } from './responses-object';
import { SecurityRequirementObject } from './security-requirement-object';
import { booleanOption, stringArrayOption, stringOption } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { array, type, union } from 'io-ts';

export interface OperationObject {
	readonly tags: Option<string[]>;
	readonly summary: Option<string>;
	readonly description: Option<string>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
	readonly operationId: Option<string>;
	readonly consumes: Option<string[]>;
	readonly produces: Option<string[]>;
	readonly parameters: Option<Array<ReferenceObject | ParameterObject>>;
	readonly responses: ResponsesObject;
	readonly schemes: Option<string[]>;
	readonly deprecated: Option<boolean>;
	readonly security: Option<SecurityRequirementObject[]>;
}

export const OperationObject = type(
	{
		tags: stringArrayOption,
		summary: stringOption,
		description: stringOption,
		externalDocs: optionFromNullable(ExternalDocumentationObject),
		operationId: stringOption,
		consumes: stringArrayOption,
		produces: stringArrayOption,
		parameters: optionFromNullable(array(union([ParameterObject, ReferenceObject]))),
		responses: ResponsesObject,
		schemes: stringArrayOption,
		deprecated: booleanOption,
		security: optionFromNullable(array(SecurityRequirementObject)),
	},
	'OperationObject',
);
