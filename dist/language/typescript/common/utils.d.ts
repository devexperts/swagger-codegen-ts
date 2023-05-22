import { SerializedPathParameter } from './data/serialized-path-parameter';
import { Options } from 'prettier';
import { ResolveRefContext } from '../../../utils/ref';
import { Kind } from '../../../utils/types';
import { option, nonEmptyArray } from 'fp-ts';
export declare const SUCCESSFUL_CODES: string[];
export declare const CONTROLLERS_DIRECTORY = "controllers";
export declare const DEFINITIONS_DIRECTORY = "definitions";
export declare type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export declare type XHRResponseType = 'json' | 'blob' | 'text';
export declare const getTypeName: (name: string) => string;
export declare const getIOName: (name: string) => string;
export declare const getURL: (pattern: string, pathParameters: SerializedPathParameter[]) => string;
export declare const getJSDoc: (lines: string[]) => string;
export declare const defaultPrettierConfig: Options;
export interface SerializeOptions {
    prettierConfig?: Options;
}
export declare const pathsRef: import("fp-ts/lib/Either").Either<Error, import("../../../utils/ref").Ref<"#/paths">>;
export declare const getKindValue: (kind: Kind, value: string) => string;
export declare const getControllerName: (name: string) => string;
export declare const escapeCommpent: (value: string) => string;
export declare const UNSAFE_PROPERTY_PATTERN: RegExp;
export declare const getSafePropertyName: (value: string) => string;
export declare const context: import("fp-ts/lib/Reader").Reader<ResolveRefContext, ResolveRefContext>;
export declare const getKeyMatchValue: <T extends string, A>(record: Record<T, A>, regexp: RegExp) => option.Option<{
    key: T;
    value: Record<T, A>[T];
}>;
export declare const getKeyMatchValues: <T extends string, A>(record: Record<T, A>, regexp: RegExp) => option.Option<nonEmptyArray.NonEmptyArray<{
    key: T;
    value: Record<T, A>[T];
}>>;
export declare const DEFAULT_MEDIA_TYPE = "application/json";
export declare const getResponseTypeFromMediaType: (mediaType: string) => XHRResponseType;
