import { ResponseObject } from '../../../../schema/2.0/response-object';
import { SerializedType } from '../../common/data/serialized-type';
import { Either } from 'fp-ts/lib/Either';
import { Ref } from '../../../../utils/ref';
export declare const serializeResponseObject: (from: Ref<string>, response: ResponseObject) => Either<Error, SerializedType>;
