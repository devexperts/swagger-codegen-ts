import { Option } from 'fp-ts/lib/Option';
import { ObjectSchemaObject } from './schema-object';
import { Codec } from '../../utils/io-ts';
export interface WebsocketsChannelBindingObject {
    readonly method: Option<'GET' | 'POST'>;
    readonly query: Option<ObjectSchemaObject>;
    readonly headers: Option<ObjectSchemaObject>;
    readonly bindingVersion: Option<string>;
}
export declare const WebsocketsChannelBindingObjectCodec: Codec<WebsocketsChannelBindingObject>;
