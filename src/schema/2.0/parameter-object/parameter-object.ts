import { PathParameterObject } from './path-parameter-object';
import { QueryParameterObject } from './query-parameter-object';
import { HeaderParameterObject } from './header-parameter-object';
import { FormDataParameterObject } from './form-data-parameter-object';
import { BodyParameterObject } from './body-parameter-object';
import * as t from 'io-ts';

export type ParameterObject =
	| PathParameterObject
	| QueryParameterObject
	| HeaderParameterObject
	| FormDataParameterObject
	| BodyParameterObject;

export const ParameterObject = t.union(
	[PathParameterObject, QueryParameterObject, HeaderParameterObject, FormDataParameterObject, BodyParameterObject],
	'ParameterObject',
);
