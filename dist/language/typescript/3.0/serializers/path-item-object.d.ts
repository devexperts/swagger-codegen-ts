import { SerializedType } from '../../common/data/serialized-type';
import { Either } from 'fp-ts/lib/Either';
import { option } from 'fp-ts';
import { Ref } from '../../../../utils/ref';
import { PathItemObject } from '../../../../schema/3.0/path-item-object';
import { Kind } from '../../../../utils/types';
export declare const serializePathItemObject: import("fp-ts/lib/Reader").Reader<import("../../../../utils/ref").ResolveRefContext & import("./schema-object").SerializeSchemaObjectWithRecursionContext, (pattern: string, item: PathItemObject, from: Ref<string>, kind: Kind) => Either<Error, SerializedType>>;
export declare const serializePathItemObjectTags: (pathItemObject: PathItemObject) => option.Option<string>;
