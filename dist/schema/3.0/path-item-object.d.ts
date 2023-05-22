import { OperationObject } from './operation-object';
import { ServerObject } from './server-object';
import { ReferenceObject } from './reference-object';
import { ParameterObject } from './parameter-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface PathItemObject {
    readonly $ref: Option<string>;
    readonly summary: Option<string>;
    readonly description: Option<string>;
    readonly get: Option<OperationObject>;
    readonly put: Option<OperationObject>;
    readonly post: Option<OperationObject>;
    readonly delete: Option<OperationObject>;
    readonly options: Option<OperationObject>;
    readonly head: Option<OperationObject>;
    readonly patch: Option<OperationObject>;
    readonly trace: Option<OperationObject>;
    readonly servers: Option<ServerObject[]>;
    readonly parameters: Option<Array<ReferenceObject | ParameterObject>>;
}
export declare const PathItemObjectCodec: Codec<PathItemObject>;
