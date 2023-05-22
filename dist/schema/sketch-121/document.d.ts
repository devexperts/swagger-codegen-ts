import { Codec } from '../../utils/io-ts';
import { AbstractDocument } from './abstract-document';
import { Page } from './objects/page';
export interface Document extends AbstractDocument {
    readonly pages: Page[];
}
export declare const DocumentCodec: Codec<Document>;
