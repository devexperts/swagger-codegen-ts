import { Ref } from '../../../../utils/ref';
import { MessageObject } from '../../../../schema/asyncapi-2.0.0/message-object';
import { Either } from 'fp-ts/lib/Either';
import { SerializedType } from '../../common/data/serialized-type';
export declare const serializeMessageObject: (from: Ref<string>, messageObject: MessageObject) => Either<Error, SerializedType>;
