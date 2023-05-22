import { Option } from 'fp-ts/lib/Option';
import { ReferenceObject } from './reference-object';
import { CorrelationIdObject } from './correlation-id-object';
import { TagsObject } from './tags-object';
import { ExternalDocumentationObject } from './external-documentation-object';
import { MessageTraitObject } from './message-trait-object';
import { ObjectSchemaObject, SchemaObject } from './schema-object';
import { Codec } from '../../utils/io-ts';
export interface MessageObject {
    readonly headers: Option<ObjectSchemaObject>;
    readonly payload: ReferenceObject | SchemaObject;
    readonly correlationId: Option<ReferenceObject | CorrelationIdObject>;
    readonly schemaFormat: Option<string>;
    readonly contentType: Option<string>;
    readonly name: Option<string>;
    readonly title: Option<string>;
    readonly summary: Option<string>;
    readonly description: Option<string>;
    readonly tags: Option<TagsObject>;
    readonly externalDocs: Option<ExternalDocumentationObject>;
    readonly examples: Option<Record<string, unknown>[]>;
    readonly traits: Option<MessageTraitObject[]>;
}
export declare const MessageObjectCodec: Codec<MessageObject>;
