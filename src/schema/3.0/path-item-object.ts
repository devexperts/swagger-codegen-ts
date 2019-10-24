import { array, string, type, union } from 'io-ts';
import { OperationObject, OperationObjectCodec } from './operation-object';
import { ServerObject, ServerObjectCodec } from './server-object';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { ParameterObject, ParameterObjectCodec } from './parameter-object';
import { Option } from 'fp-ts/lib/Option';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { Codec } from '../../utils/io-ts';

export interface PathItemObject {
	readonly $ref: Option<string>;
	readonly summary: Option<string>;
	readonly description: Option<string>;
	readonly get: Option<OperationObject>;
	readonly put: Option<OperationObject>;
	readonly post: Option<OperationObject>;
	readonly delete: Option<OperationObject>;
	readonly options: Option<OperationObject>;
	readonly head: Option<OperationObject>;
	readonly patch: Option<OperationObject>;
	readonly trace: Option<OperationObject>;
	readonly servers: Option<ServerObject[]>;
	readonly parameters: Option<Array<ReferenceObject | ParameterObject>>;
}

export const PathItemObjectCodec: Codec<PathItemObject> = type(
	{
		$ref: optionFromNullable(string),
		summary: optionFromNullable(string),
		description: optionFromNullable(string),
		get: optionFromNullable(OperationObjectCodec),
		put: optionFromNullable(OperationObjectCodec),
		post: optionFromNullable(OperationObjectCodec),
		delete: optionFromNullable(OperationObjectCodec),
		options: optionFromNullable(OperationObjectCodec),
		head: optionFromNullable(OperationObjectCodec),
		patch: optionFromNullable(OperationObjectCodec),
		trace: optionFromNullable(OperationObjectCodec),
		servers: optionFromNullable(array(ServerObjectCodec)),
		parameters: optionFromNullable(array(union([ReferenceObjectCodec, ParameterObjectCodec]))),
	},
	'PathItemObject',
);
