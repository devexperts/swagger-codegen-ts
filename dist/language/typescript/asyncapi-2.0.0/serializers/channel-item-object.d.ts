import { Ref } from '../../../../utils/ref';
import { ChannelItemObject } from '../../../../schema/asyncapi-2.0.0/channel-item-object';
import { Either } from 'fp-ts/lib/Either';
import { SerializedType } from '../../common/data/serialized-type';
import { Kind } from '../../../../utils/types';
export declare const serializeChannelItemObject: import("fp-ts/lib/Reader").Reader<import("../../../../utils/ref").ResolveRefContext, (from: Ref<string>, channel: string, channelItemObject: ChannelItemObject, kind: Kind) => Either<Error, SerializedType>>;
