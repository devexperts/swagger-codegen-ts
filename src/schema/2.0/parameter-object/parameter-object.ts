import { PathParameterObject } from './path-parameter-object/path-parameter-object';
import { QueryParameterObject } from './query-parameter-object/query-parameter-object';
import { HeaderParameterObject } from './header-parameter-object';
import { FormDataParameterObject } from './form-data-parameter-object';
import { BodyParameterObject } from './body-parameter-object';
import { union } from 'io-ts';

export type ParameterObject =
	| PathParameterObject
	| QueryParameterObject
	| HeaderParameterObject
	| FormDataParameterObject
	| BodyParameterObject;

export const ParameterObject = union(
	[PathParameterObject, QueryParameterObject, HeaderParameterObject, FormDataParameterObject, BodyParameterObject],
	'ParameterObject',
);
