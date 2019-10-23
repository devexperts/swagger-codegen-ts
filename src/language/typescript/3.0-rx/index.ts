import { serializeDocument } from './serializers/document';
import { format } from 'prettier';
import { directory, FSEntity, map as mapFS } from '../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { either, record } from 'fp-ts';
import { Dictionary } from '../../../utils/types';
import { sequenceEither } from '../../../utils/either';
import { OpenapiObject } from '../../../schema/3.0/openapi-object';
import { defaultPrettierConfig, SerializeOptions } from '../common/utils';

export { serializeDocument } from './serializers/document';

export const serialize = combineReader(
	serializeDocument,
	serializeDocument => (
		out: string,
		documents: Dictionary<OpenapiObject>,
		options: SerializeOptions = {},
	): Either<Error, FSEntity> =>
		pipe(
			documents,
			record.collect(serializeDocument),
			sequenceEither,
			either.map(serialized => directory(out, serialized)),
			either.map(e => mapFS(e, content => format(content, options.prettierConfig || defaultPrettierConfig))),
		),
);
