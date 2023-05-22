import { AsyncAPIObject } from '../../../schema/asyncapi-2.0.0/asyncapi-object';
import { SerializeOptions } from '../common/utils';
import { Either } from 'fp-ts/lib/Either';
import { FSEntity } from '../../../utils/fs';
export declare const serialize: import("fp-ts/lib/Reader").Reader<import("../../../utils/ref").ResolveRefContext, (documents: Record<string, AsyncAPIObject>, options?: SerializeOptions) => Either<Error, FSEntity>>;
