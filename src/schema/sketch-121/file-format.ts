import { Meta, MetaCodec } from './meta';
import { User, UserCodec } from './user';
import { Codec } from '../../utils/io-ts';
import { type } from 'io-ts';
import { Document, DocumentCodec } from './document';

export interface FileFormat {
	readonly document: Document;
	readonly meta: Meta;
	readonly user: User;
}

export const FileFormatCodec: Codec<FileFormat> = type({
	document: DocumentCodec,
	meta: MetaCodec,
	user: UserCodec,
});
