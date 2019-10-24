import { array, boolean, string, type, union } from 'io-ts';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { ParameterObject, ParameterObjectCodec } from './parameter-object';
import { RequestBodyObject, RequestBodyObjectCodec } from './request-body-object';
import { ResponsesObject, ResponsesObjectCodec } from './responses-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface OperationObject {
	readonly tags: Option<string[]>;
	readonly summary: Option<string>;
	readonly description: Option<string>;
	readonly operationId: Option<string>;
	readonly parameters: Option<Array<ReferenceObject | ParameterObject>>;
	readonly requestBody: Option<RequestBodyObject | ReferenceObject>;
	readonly responses: ResponsesObject;
	readonly deprecated: Option<boolean>;
}

export const OperationObjectCodec: Codec<OperationObject> = type(
	{
		tags: optionFromNullable(array(string)),
		summary: optionFromNullable(string),
		description: optionFromNullable(string),
		operationId: optionFromNullable(string),
		parameters: optionFromNullable(array(union([ReferenceObjectCodec, ParameterObjectCodec]))),
		requestBody: optionFromNullable(union([ReferenceObjectCodec, RequestBodyObjectCodec])),
		responses: ResponsesObjectCodec,
		deprecated: optionFromNullable(boolean),
	},
	'OperationObject',
);
