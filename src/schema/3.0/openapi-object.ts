import { literal, Type, type, union } from 'io-ts';
import { PathsObject, PathsObjectCodec } from './paths-object';
import { ComponentsObject, ComponentsObjectCodec } from './components-object';
import { Option } from 'fp-ts/lib/Option';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface OpenapiObject {
	readonly openapi: '3.0.0' | '3.0.1' | '3.0.2';
	readonly paths: PathsObject;
	readonly components: Option<ComponentsObject>;
}

export const OpenapiObjectCodec: Type<OpenapiObject, unknown> = type(
	{
		openapi: union([literal('3.0.0'), literal('3.0.1'), literal('3.0.2')], 'OpenapiObject'),
		paths: PathsObjectCodec,
		components: optionFromNullable(ComponentsObjectCodec),
	},
	'OpenapiObject',
);
