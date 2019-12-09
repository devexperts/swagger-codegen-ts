import { defaultPrettierConfig, SerializeOptions } from '../common/utils';
import { directory, fragment, FSEntity, map as mapFS } from '../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, option, record } from 'fp-ts';
import { format } from 'prettier';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { FileFormat } from '../../../schema/sketch-121/file-format';
import { serializeFileFormat } from './serializers/file-format';

export const serialize = combineReader(
	serializeFileFormat,
	serializeFileFormat => (
		files: Record<string, FileFormat>,
		options: SerializeOptions = {},
	): Either<Error, FSEntity> =>
		pipe(
			files,
			record.collect((name, file) =>
				pipe(
					serializeFileFormat(file),
					either.map(option.map(content => directory(name, [content]))),
				),
			),
			sequenceEither,
			either.map(serialized =>
				mapFS(fragment(array.compact(serialized)), content =>
					format(content, options.prettierConfig || defaultPrettierConfig),
				),
			),
		),
);
