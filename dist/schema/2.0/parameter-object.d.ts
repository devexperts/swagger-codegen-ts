import { Codec } from '../../utils/io-ts';
import { SchemaObject } from './schema-object';
import { Option } from 'fp-ts/lib/Option';
import { ItemsObject } from './items-object';
export interface BaseParameterObject {
    readonly required: Option<boolean>;
    readonly name: string;
    readonly description: Option<string>;
}
export declare type ArrayParameterObjectCollectionFormat = 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi';
export interface BaseArrayParameterObject {
    readonly type: 'array';
    readonly items: ItemsObject;
    readonly collectionFormat: Option<ArrayParameterObjectCollectionFormat>;
}
export interface BaseNonArrayParameterObject {
    readonly type: 'string' | 'number' | 'integer' | 'boolean';
    readonly format: Option<string>;
}
export interface BodyParameterObject extends BaseParameterObject {
    readonly in: 'body';
    readonly schema: SchemaObject;
}
export interface BaseFormDataParameterObject extends BaseParameterObject {
    readonly in: 'formData';
}
export interface ArrayFormDataParameterObject extends BaseFormDataParameterObject, BaseArrayParameterObject {
}
export interface NonArrayFormDataParameterObject extends BaseFormDataParameterObject, Omit<BaseNonArrayParameterObject, 'type'> {
    readonly type: 'string' | 'number' | 'integer' | 'boolean' | 'file';
}
export declare type FormDataParameterObject = ArrayFormDataParameterObject | NonArrayFormDataParameterObject;
export interface BaseQueryParameterObject extends BaseParameterObject {
    readonly in: 'query';
}
export interface ArrayQueryParameterObject extends BaseQueryParameterObject, BaseArrayParameterObject {
}
export declare const ArrayQueryParameterObjectCodec: Codec<ArrayQueryParameterObject>;
export interface NonArrayQueryParameterObject extends BaseQueryParameterObject, BaseNonArrayParameterObject {
}
export declare type QueryParameterObject = ArrayQueryParameterObject | NonArrayQueryParameterObject;
export interface BasePathParameterObject extends Omit<BaseParameterObject, 'required'> {
    readonly in: 'path';
    readonly required: true;
}
export interface ArrayPathParameterObject extends BasePathParameterObject, BaseArrayParameterObject {
}
export interface NonArrayPathParameterObject extends BasePathParameterObject, BaseNonArrayParameterObject {
}
export declare type PathParameterObject = ArrayPathParameterObject | NonArrayPathParameterObject;
export interface BaseHeaderParameterObject extends BaseParameterObject {
    readonly in: 'header';
}
export interface ArrayHeaderParameterObject extends BaseHeaderParameterObject, BaseArrayParameterObject {
}
export interface NonArrayHeaderParameterObject extends BaseHeaderParameterObject, BaseNonArrayParameterObject {
}
export declare type HeaderParameterObject = ArrayHeaderParameterObject | NonArrayHeaderParameterObject;
export declare type ParameterObject = BodyParameterObject | FormDataParameterObject | QueryParameterObject | PathParameterObject | HeaderParameterObject;
export declare const ParameterObjectCodec: Codec<ParameterObject>;
