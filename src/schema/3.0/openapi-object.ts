import { intersection, literal, partial, type, union } from 'io-ts';
import { PathsObject, PathsObjectCodec } from './paths-object';
import { ComponentsObject, ComponentsObjectCodec } from './components-object';

export interface OpenapiObject {
	readonly openapi: '3.0.0' | '3.0.1' | '3.0.2';
	readonly paths: PathsObject;
	readonly components?: ComponentsObject;
}

export const OpenapiObjectCodec = intersection(
	[
		type({
			openapi: union([literal('3.0.0'), literal('3.0.1'), literal('3.0.2')], 'OpenapiObject'),
			paths: PathsObjectCodec,
		}),
		partial({
			components: ComponentsObjectCodec,
		}),
	],
	'OpenapiObject',
);
