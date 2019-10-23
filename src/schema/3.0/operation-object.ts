import { array, boolean, intersection, partial, string, Type, type, union } from 'io-ts';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { ParameterObject, ParameterObjectCodec } from './parameter-object';
import { RequestBodyObject } from './request-body-object';
import { ResponsesObject, ResponsesObjectCodec } from './responses-object';

export interface OperationObject {
	readonly tags?: string[];
	readonly summary?: string;
	readonly description?: string;
	readonly operationId?: string;
	readonly parameters?: Array<ReferenceObject | ParameterObject>;
	readonly requestBody?: RequestBodyObject | ReferenceObject;
	readonly responses: ResponsesObject;
	readonly deprecated?: boolean;
}

export const OperationObjectCodec: Type<OperationObject> = intersection(
	[
		type({
			responses: ResponsesObjectCodec,
		}),
		partial({
			tags: array(string),
			summary: string,
			description: string,
			operationId: string,
			parameters: array(union([ReferenceObjectCodec, ParameterObjectCodec])),
			deprecated: boolean,
		}),
	],
	'OperationObject',
);
