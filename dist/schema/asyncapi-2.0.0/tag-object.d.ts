import { Option } from 'fp-ts/lib/Option';
import { ExternalDocumentationObject } from './external-documentation-object';
import { Codec } from '../../utils/io-ts';
export interface TagObject {
    readonly name: string;
    readonly description: Option<string>;
    readonly externalDocs: Option<ExternalDocumentationObject>;
}
export declare const TagObjectCodec: Codec<TagObject>;
