import { AsyncAPIObject } from '../../../../schema/asyncapi-2.0.0/asyncapi-object';
import { Either } from 'fp-ts/lib/Either';
import { FSEntity } from '../../../../utils/fs';
export declare const serializeAsyncAPIObject: import("fp-ts/lib/Reader").Reader<import("../../../../utils/ref").ResolveRefContext, (name: string, asyncAPIObject: AsyncAPIObject) => Either<Error, FSEntity>>;
