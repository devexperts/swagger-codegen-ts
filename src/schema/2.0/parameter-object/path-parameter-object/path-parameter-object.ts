import { StringPathParameterObject } from './string-parameter-object';
import { NumberPathParameterObject } from './number-parameter-object';
import { IntegerPathParameterObject } from './integer-parameter-object';
import { BooleanPathParameterObject } from './boolean-parameter-object';
import { ArrayPathParameterObject } from './array-parameter-object';
import { union } from 'io-ts';

export type PathParameterObject =
	| StringPathParameterObject
	| NumberPathParameterObject
	| IntegerPathParameterObject
	| BooleanPathParameterObject
	| ArrayPathParameterObject;

export const PathParameterObject = union(
	[
		StringPathParameterObject,
		NumberPathParameterObject,
		IntegerPathParameterObject,
		BooleanPathParameterObject,
		ArrayPathParameterObject,
	],
	'PathParameterObject',
);
