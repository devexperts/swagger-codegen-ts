import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { AsyncAPIObject } from '../../../schema/asyncapi-2.0.0/asyncapi-object';
import { defaultPrettierConfig, SerializeOptions } from '../common/utils';
import { Either } from 'fp-ts/lib/Either';
import { directory, FSEntity, map as mapFS } from '../../../utils/fs';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, record } from 'fp-ts';
import { format } from 'prettier';
import { serializeAsyncAPIObject } from './serializers/asyncapi-object';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';

export const serialize = combineReader(
	serializeAsyncAPIObject,
	serializeAsyncAPIObject => (
		out: string,
		documents: Record<string, AsyncAPIObject>,
		options: SerializeOptions = {},
	): Either<Error, FSEntity> =>
		pipe(
			documents,
			record.collect(serializeAsyncAPIObject),
			sequenceEither,
			either.map(serialized => directory(out, serialized)),
			either.map(e => mapFS(e, content => format(content, options.prettierConfig || defaultPrettierConfig))),
		),
);
