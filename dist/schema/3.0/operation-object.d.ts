import { ReferenceObject } from './reference-object';
import { ParameterObject } from './parameter-object';
import { RequestBodyObject } from './request-body-object';
import { ResponsesObject } from './responses-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface OperationObject {
    readonly tags: Option<string[]>;
    readonly summary: Option<string>;
    readonly description: Option<string>;
    readonly operationId: Option<string>;
    readonly parameters: Option<Array<ReferenceObject | ParameterObject>>;
    readonly requestBody: Option<RequestBodyObject | ReferenceObject>;
    readonly responses: ResponsesObject;
    readonly deprecated: Option<boolean>;
}
export declare const OperationObjectCodec: Codec<OperationObject>;
