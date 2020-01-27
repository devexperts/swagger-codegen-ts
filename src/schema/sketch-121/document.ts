import { Codec } from '../../utils/io-ts';
import { array, intersection, type } from 'io-ts';
import { AbstractDocument, AbstractDocumentCodec } from './abstract-document';
import { Page, PageCodec } from './objects/page';

export interface Document extends AbstractDocument {
	readonly pages: Page[];
}

export const DocumentCodec: Codec<Document> = intersection(
	[
		AbstractDocumentCodec,
		type({
			pages: array(PageCodec),
		}),
	],
	'Document',
);
