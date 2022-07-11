import { ItemsObject } from '../../../../schema/2.0/items-object';
import { SerializedType } from '../../common/data/serialized-type';
import { Ref } from '../../../../utils/ref';
import { either } from 'fp-ts';
export declare const serializeItemsObject: (from: Ref<string>, itemsObject: ItemsObject) => either.Either<Error, SerializedType>;
