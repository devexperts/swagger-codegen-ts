import { ReferenceObject } from './reference-object';
import { SchemaObject } from './schema-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { ParameterObject } from './parameter-object';
import { ResponseObject } from './response-object';
import { RequestBodyObject } from './request-body-object';
export interface ComponentsObject {
    readonly schemas: Option<Record<string, ReferenceObject | SchemaObject>>;
    readonly parameters: Option<Record<string, ReferenceObject | ParameterObject>>;
    readonly responses: Option<Record<string, ReferenceObject | ResponseObject>>;
    readonly requestBodies: Option<Record<string, ReferenceObject | RequestBodyObject>>;
}
export declare const ComponentsObjectCodec: Codec<ComponentsObject>;
