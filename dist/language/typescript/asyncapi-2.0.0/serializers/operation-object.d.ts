import { Ref } from '../../../../utils/ref';
import { OperationObject } from '../../../../schema/asyncapi-2.0.0/operation-object';
import { Either } from 'fp-ts/lib/Either';
import { SerializedType } from '../../common/data/serialized-type';
import { Kind } from '../../../../utils/types';
export declare const serializePublishOperationObject: (from: Ref<string>, channel: string, operationObject: OperationObject) => Either<Error, SerializedType>;
export declare const serializeSubscribeOperationObject: (from: Ref<string>, channel: string, operationObject: OperationObject, kind: Kind) => Either<Error, SerializedType>;
