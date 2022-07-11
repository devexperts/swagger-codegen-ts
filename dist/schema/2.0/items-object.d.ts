import { Codec } from '../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';
export interface BaseItemsObject {
    readonly format: Option<string>;
    readonly collectionFormat: Option<'csv' | 'ssv' | 'tsv' | 'pipes'>;
    readonly maximum: Option<number>;
    readonly exclusiveMaximum: Option<boolean>;
    readonly minimum: Option<number>;
    readonly exclusiveMinimum: Option<boolean>;
    readonly maxLength: Option<number>;
    readonly minLength: Option<number>;
    readonly pattern: Option<string>;
    readonly maxItems: Option<number>;
    readonly minItems: Option<number>;
    readonly uniqueItems: Option<boolean>;
    readonly enum: Option<Array<string | number | boolean>>;
    readonly multipleOf: Option<number>;
}
export declare type ArrayItemsObjectCollectionFormat = 'csv' | 'ssv' | 'tsv' | 'pipes';
export interface ArrayItemsObject extends BaseItemsObject {
    readonly type: 'array';
    readonly items: ItemsObject;
    readonly collectionFormat: Option<ArrayItemsObjectCollectionFormat>;
}
export interface NonArrayItemsObject extends BaseItemsObject {
    readonly type: 'string' | 'number' | 'integer' | 'boolean';
}
export declare type ItemsObject = ArrayItemsObject | NonArrayItemsObject;
export declare const ItemsObjectCodec: Codec<ItemsObject>;
