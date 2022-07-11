import { Option } from 'fp-ts/lib/Option';
import { InfoObject } from './info-object';
import { ServersObject } from './servers-object';
import { Codec } from '../../utils/io-ts';
import { ChannelsObject } from './channels-object';
import { ComponentsObject } from './components-object';
import { TagsObject } from './tags-object';
import { ExternalDocumentationObject } from './external-documentation-object';
export interface AsyncAPIObject {
    readonly asyncapi: '2.0.0';
    readonly info: InfoObject;
    readonly servers: Option<ServersObject>;
    readonly channels: ChannelsObject;
    readonly components: Option<ComponentsObject>;
    readonly tags: Option<TagsObject>;
    readonly externalDocs: Option<ExternalDocumentationObject>;
}
export declare const AsyncAPIObjectCodec: Codec<AsyncAPIObject>;
