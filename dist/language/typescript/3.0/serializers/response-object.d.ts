import { SerializedType } from '../../common/data/serialized-type';
import { Either } from 'fp-ts/lib/Either';
import { Ref } from '../../../../utils/ref';
import { option } from 'fp-ts';
import { ResponseObject } from '../../../../schema/3.0/response-object';
export declare type SerializedResponse = {
    mediaType: string;
    schema: SerializedType;
};
export declare const serializeResponseObject: import("fp-ts/lib/Reader").Reader<import("./schema-object").SerializeSchemaObjectWithRecursionContext, (from: Ref<string>, responseObject: ResponseObject) => option.Option<Either<Error, SerializedType>>>;
export declare const serializeResponseObjectWithMediaType: import("fp-ts/lib/Reader").Reader<import("./schema-object").SerializeSchemaObjectWithRecursionContext, (from: Ref<string>, responseObject: ResponseObject) => option.Option<Either<Error, SerializedResponse[]>>>;
