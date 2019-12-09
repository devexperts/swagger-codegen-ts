import { serializeDocument } from './serializers/document';
import { format } from 'prettier';
import { fragment, FSEntity, map as mapFS } from '../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { either, record } from 'fp-ts';
import { Dictionary } from '../../../utils/types';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { OpenapiObject } from '../../../schema/3.0/openapi-object';
import { defaultPrettierConfig, SerializeOptions } from '../common/utils';

export { serializeDocument } from './serializers/document';

export const serialize = combineReader(
	serializeDocument,
	serializeDocument => (
		documents: Dictionary<OpenapiObject>,
		options: SerializeOptions = {},
	): Either<Error, FSEntity> =>
		pipe(
			documents,
			record.collect(serializeDocument),
			sequenceEither,
			either.map(e =>
				mapFS(fragment(e), content => format(content, options.prettierConfig || defaultPrettierConfig)),
			),
		),
);
