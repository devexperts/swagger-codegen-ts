import { FileInfo } from 'json-schema-ref-parser';
import * as AdmZip from 'adm-zip';
import { array, string, type } from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either';

const log = (...args: unknown[]): void => console.log('[SKETCH-PARSER]:', ...args);

export const sketchParser = {
	order: 90,
	allowEmpty: false,
	canParse: (file: FileInfo): boolean => file.extension === 'sketch',
	parse: async (file: FileInfo): Promise<unknown> => {
		log('Unzipping', file.url);
		const zip = new AdmZip(file.data);
		log('Parsing document.json');
		const document = toJSON(zip.getEntry('document.json').getData());
		log('Parsing meta.json');
		const meta = toJSON(zip.getEntry('meta.json').getData());
		log('Parsing user.json');
		const user = toJSON(zip.getEntry('user.json').getData());

		const decodedDocument = documentCodec.decode(document);
		if (isLeft(decodedDocument)) {
			throw decodedDocument.left;
		}
		const pages = decodedDocument.right.pages.map(page => {
			const entry = `${page._ref}.json`;
			log('Parsing', entry);
			return toJSON(zip.getEntry(entry).getData());
		});

		log('Done');
		return {
			document: {
				...document,
				pages,
			},
			meta,
			user,
		};
	},
};

const documentCodec = type({
	pages: array(
		type({
			_ref: string,
		}),
	),
});

const toJSON = (buffer: Buffer): unknown => JSON.parse(buffer.toString('utf-8'));
