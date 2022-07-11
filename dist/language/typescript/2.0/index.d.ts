import { SwaggerObject } from '../../../schema/2.0/swagger-object';
import { SerializeOptions } from '../common/utils';
import { FSEntity } from '../../../utils/fs';
import { Dictionary } from '../../../utils/types';
import { either } from 'fp-ts';
export declare const serialize: import("fp-ts/lib/Reader").Reader<import("../../../utils/ref").ResolveRefContext, (documents: Dictionary<SwaggerObject>, options?: SerializeOptions) => either.Either<Error, FSEntity>>;
