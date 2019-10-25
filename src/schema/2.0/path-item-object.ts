import { stringOption } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { OperationObject } from './operation-object';
import { ParameterObject } from './parameter-object/parameter-object';
import { Reference, ReferenceObject } from './reference-object';
import { Option } from 'fp-ts/lib/Option';
import { array, type, union } from 'io-ts';

export interface PathItemObject {
	readonly $ref: Option<string>;
	readonly get: Option<OperationObject>;
	readonly put: Option<OperationObject>;
	readonly post: Option<OperationObject>;
	readonly delete: Option<OperationObject>;
	readonly options: Option<OperationObject>;
	readonly head: Option<OperationObject>;
	readonly patch: Option<OperationObject>;
	readonly parameters: Option<Reference<ParameterObject>[]>;
}

export const PathItemObject = type(
	{
		$ref: stringOption,
		get: optionFromNullable(OperationObject),
		put: optionFromNullable(OperationObject),
		post: optionFromNullable(OperationObject),
		delete: optionFromNullable(OperationObject),
		options: optionFromNullable(OperationObject),
		head: optionFromNullable(OperationObject),
		patch: optionFromNullable(OperationObject),
		parameters: optionFromNullable(array(union([ParameterObject, ReferenceObject]))),
	},
	'PathItemObject',
);
