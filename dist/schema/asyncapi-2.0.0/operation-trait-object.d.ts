import { Option } from 'fp-ts/lib/Option';
import { TagsObject } from './tags-object';
import { ExternalDocumentationObject } from './external-documentation-object';
import { Codec } from '../../utils/io-ts';
export interface OperationTraitObject {
    readonly operationId: Option<string>;
    readonly summary: Option<string>;
    readonly description: Option<string>;
    readonly tags: Option<TagsObject>;
    readonly externalDocs: Option<ExternalDocumentationObject>;
}
export declare const OperationTraitObjectCodec: Codec<OperationTraitObject>;
