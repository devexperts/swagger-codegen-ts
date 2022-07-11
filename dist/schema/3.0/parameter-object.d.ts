import { ReferenceObject } from './reference-object';
import { SchemaObject } from './schema-object';
import { MediaTypeObject } from './media-type-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export declare type ParameterObjectStyle = 'matrix' | 'label' | 'form' | 'simple' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
export interface BaseParameterObject {
    readonly name: string;
    readonly description: Option<string>;
    readonly deprecated: Option<boolean>;
    readonly schema: Option<ReferenceObject | SchemaObject>;
    readonly content: Option<Record<string, MediaTypeObject>>;
    readonly explode: Option<boolean>;
    readonly style: Option<ParameterObjectStyle>;
}
export interface PathParameterObject extends BaseParameterObject {
    readonly in: 'path';
    readonly required: true;
}
export interface HeaderParameterObject extends BaseParameterObject {
    readonly in: 'header';
    readonly required: Option<boolean>;
}
export interface QueryParameterObject extends BaseParameterObject {
    readonly in: 'query';
    readonly required: Option<boolean>;
}
export interface CookieParameterObject extends BaseParameterObject {
    readonly in: 'cookie';
    readonly required: Option<boolean>;
}
export declare type ParameterObject = PathParameterObject | HeaderParameterObject | QueryParameterObject | CookieParameterObject;
export declare const ParameterObjectCodec: Codec<ParameterObject>;
