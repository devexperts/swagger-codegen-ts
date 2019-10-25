import { StringQueryParameterObject } from './string-query-parameter-object';
import { NumberQueryParameterObject } from './number-query-parameter-object';
import { IntegerQueryParameterObject } from './integer-query-parameter-object';
import { BooleanQueryParameterObject } from './boolean-query-parameter-object';
import { ArrayQueryParameterObject } from './array-query-parameter-object';
import { union } from 'io-ts';

export type QueryParameterObject =
	| StringQueryParameterObject
	| NumberQueryParameterObject
	| IntegerQueryParameterObject
	| BooleanQueryParameterObject
	| ArrayQueryParameterObject;

export const QueryParameterObject = union(
	[
		StringQueryParameterObject,
		NumberQueryParameterObject,
		IntegerQueryParameterObject,
		BooleanQueryParameterObject,
		ArrayQueryParameterObject,
	],
	'QueryParameterObject',
);
