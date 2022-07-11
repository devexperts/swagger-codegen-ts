import { FSEntity } from '../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { Dictionary } from '../../../utils/types';
import { OpenapiObject } from '../../../schema/3.0/openapi-object';
import { SerializeOptions } from '../common/utils';
export { serializeDocument } from './serializers/document';
export declare const serializeCustom: import("fp-ts/lib/Reader").Reader<Pick<import("../../../utils/ref").ResolveRefContext & import("./serializers/schema-object").SerializeSchemaObjectWithRecursionContext, "serializePrimitive">, import("fp-ts/lib/Reader").Reader<Pick<import("../../../utils/ref").ResolveRefContext & import("./serializers/schema-object").SerializeSchemaObjectWithRecursionContext, "resolveRef">, (documents: Dictionary<OpenapiObject>, options?: SerializeOptions) => Either<Error, FSEntity>>>;
export declare const serialize: import("fp-ts/lib/Reader").Reader<Pick<import("../../../utils/ref").ResolveRefContext & import("./serializers/schema-object").SerializeSchemaObjectWithRecursionContext, "resolveRef">, (documents: Dictionary<OpenapiObject>, options?: SerializeOptions) => Either<Error, FSEntity>>;
