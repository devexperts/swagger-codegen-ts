import { Option } from 'fp-ts/lib/Option';
import { ReferenceObject } from './reference-object';
import { CorrelationIdObject } from './correlation-id-object';
import { TagsObject } from './tags-object';
import { ExternalDocumentationObject } from './external-documentation-object';
import { Codec } from '../../utils/io-ts';
import { ObjectSchemaObject } from './schema-object';
export interface MessageTraitObject {
    readonly headers: Option<ReferenceObject | ObjectSchemaObject>;
    readonly correlationId: Option<ReferenceObject | CorrelationIdObject>;
    readonly schemaFormat: Option<string>;
    readonly contentType: Option<string>;
    readonly name: Option<string>;
    readonly title: Option<string>;
    readonly summary: Option<string>;
    readonly description: Option<string>;
    readonly tags: Option<TagsObject>;
    readonly externalDocs: Option<ExternalDocumentationObject>;
    readonly examples: Option<Record<string, unknown>>;
}
export declare const MessageTraitObjectCodec: Codec<MessageTraitObject>;
