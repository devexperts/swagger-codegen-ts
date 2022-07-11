import { SerializedType } from '../../common/data/serialized-type';
import { Either } from 'fp-ts/lib/Either';
import { option } from 'fp-ts';
import { Ref } from '../../../../utils/ref';
import { RequestBodyObject } from '../../../../schema/3.0/request-body-object';
import { MediaTypeObject } from '../../../../schema/3.0/media-type-object';
export declare const getRequestMedia: (content: Record<string, MediaTypeObject>) => option.Option<{
    key: string;
    value: MediaTypeObject;
}>;
export declare const serializeRequestBodyObject: import("fp-ts/lib/Reader").Reader<import("./schema-object").SerializeSchemaObjectWithRecursionContext, (from: Ref<string>, body: RequestBodyObject) => Either<Error, SerializedType>>;
