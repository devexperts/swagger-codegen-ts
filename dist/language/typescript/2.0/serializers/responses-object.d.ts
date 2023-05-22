import { ResponsesObject } from '../../../../schema/2.0/responses-object';
import { SerializedType } from '../../common/data/serialized-type';
import { either } from 'fp-ts';
import { Ref } from '../../../../utils/ref';
export declare const serializeOperationResponses: (from: Ref<string>, responses: ResponsesObject) => either.Either<Error, SerializedType>;
