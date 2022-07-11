import { Meta } from './meta';
import { User } from './user';
import { Codec } from '../../utils/io-ts';
import { Document } from './document';
export interface FileFormat {
    readonly document: Document;
    readonly meta: Meta;
    readonly user: User;
}
export declare const FileFormatCodec: Codec<FileFormat>;
