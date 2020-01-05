import { SwaggerObject } from '../../../schema/2.0/swagger-object';
import { defaultPrettierConfig, SerializeOptions } from '../common/utils';
import { fragment, FSEntity, map } from '../../../utils/fs';
import { Dictionary } from '../../../utils/types';
import { either, record } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSwaggerObject } from './serializers/swagger-object';
import { format } from 'prettier';
import { Either } from 'fp-ts/lib/Either';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';

export const serialize = combineReader(
	serializeSwaggerObject,
	serializeSwaggerObject => (
		documents: Dictionary<SwaggerObject>,
		options: SerializeOptions = {},
	): Either<Error, FSEntity> =>
		pipe(
			documents,
			record.collect(serializeSwaggerObject),
			sequenceEither,
			either.map(serialized =>
				map(fragment(serialized), content => format(content, options.prettierConfig || defaultPrettierConfig)),
			),
		),
);
