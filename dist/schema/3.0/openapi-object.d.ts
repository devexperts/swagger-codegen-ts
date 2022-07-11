import { Type } from 'io-ts';
import { PathsObject } from './paths-object';
import { ComponentsObject } from './components-object';
import { Option } from 'fp-ts/lib/Option';
export interface OpenapiObject {
    readonly openapi: '3.0.0' | '3.0.1' | '3.0.2';
    readonly paths: PathsObject;
    readonly components: Option<ComponentsObject>;
}
export declare const OpenapiObjectCodec: Type<OpenapiObject, unknown>;
