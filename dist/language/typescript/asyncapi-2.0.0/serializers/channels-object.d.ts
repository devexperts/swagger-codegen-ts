import { Either } from 'fp-ts/lib/Either';
import { FSEntity } from '../../../../utils/fs';
import { Ref } from '../../../../utils/ref';
import { ChannelsObject } from '../../../../schema/asyncapi-2.0.0/channels-object';
export declare const serializeChannelsObject: import("fp-ts/lib/Reader").Reader<import("../../../../utils/ref").ResolveRefContext, (from: Ref<string>, channelsObject: ChannelsObject) => Either<Error, FSEntity>>;
