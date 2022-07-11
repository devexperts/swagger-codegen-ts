import { Option } from 'fp-ts/lib/Option';
import { TagsObject } from './tags-object';
import { ExternalDocumentationObject } from './external-documentation-object';
import { Codec } from '../../utils/io-ts';
import { OperationTraitObject } from './operation-trait-object';
import { MessageObject } from './message-object';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { ReferenceObject } from './reference-object';
export interface OperationObjectOneOfMessage {
    readonly oneOf: NonEmptyArray<ReferenceObject | MessageObject>;
}
export declare const OperationObjectOneOfMessageCodec: Codec<OperationObjectOneOfMessage>;
export interface OperationObject {
    readonly operationId: Option<string>;
    readonly summary: Option<string>;
    readonly description: Option<string>;
    readonly tags: Option<TagsObject>;
    readonly externalDocs: Option<ExternalDocumentationObject>;
    readonly traits: Option<OperationTraitObject[]>;
    readonly message: ReferenceObject | MessageObject | OperationObjectOneOfMessage;
}
export declare const OperationObjectCodec: Codec<OperationObject>;
