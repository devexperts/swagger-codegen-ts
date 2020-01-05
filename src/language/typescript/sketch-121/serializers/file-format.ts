import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { serializeDocument } from './document';
import { FileFormat } from '../../../../schema/sketch-121/file-format';
import { Either } from 'fp-ts/lib/Either';
import { fragment, FSEntity } from '../../../../utils/fs';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, nonEmptyArray, option } from 'fp-ts';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { Option } from 'fp-ts/lib/Option';

export const serializeFileFormat = combineReader(
	serializeDocument,
	serializeDocument => (fileFormat: FileFormat): Either<Error, Option<FSEntity>> => {
		const document = serializeDocument(fileFormat.document);

		return combineEither(document, document =>
			pipe(nonEmptyArray.fromArray(array.compact([document])), option.map(fragment)),
		);
	},
);
