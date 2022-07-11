import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface ExternalDocumentationObject {
    readonly description: Option<string>;
    readonly url: string;
}
export declare const ExternalDocumentationObjectCodec: Codec<ExternalDocumentationObject>;
