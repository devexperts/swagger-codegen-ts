import { array, partial, string, union } from 'io-ts';
import { OperationObject, OperationObjectCodec } from './operation-object';
import { ServerObject, ServerObjectCodec } from './server-object';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { ParameterObject, ParameterObjectCodec } from './parameter-object';

export interface PathItemObject {
	readonly $ref?: string;
	readonly summary?: string;
	readonly description?: string;
	readonly get?: OperationObject;
	readonly put?: OperationObject;
	readonly post?: OperationObject;
	readonly delete?: OperationObject;
	readonly options?: OperationObject;
	readonly head?: OperationObject;
	readonly patch?: OperationObject;
	readonly trace?: OperationObject;
	readonly servers?: ServerObject[];
	readonly parameters?: Array<ReferenceObject | ParameterObject>;
}

export const PathItemObjectCodec = partial(
	{
		ref: string,
		summary: string,
		description: string,
		get: OperationObjectCodec,
		put: OperationObjectCodec,
		post: OperationObjectCodec,
		delete: OperationObjectCodec,
		options: OperationObjectCodec,
		head: OperationObjectCodec,
		patch: OperationObjectCodec,
		trace: OperationObjectCodec,
		servers: array(ServerObjectCodec),
		parameters: array(union([ReferenceObjectCodec, ParameterObjectCodec])),
	},
	'PathItemObject',
);
