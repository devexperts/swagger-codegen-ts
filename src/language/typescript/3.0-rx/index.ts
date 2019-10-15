import { serializeDocument } from './serializers/document';

export { serializeDocument } from './serializers/document';

import { OpenAPIV3 } from 'openapi-types';
import { format, Options } from 'prettier';
import { directory, FSEntity, map as mapFS } from '../../../fs';
import { Either } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { array, either, record } from 'fp-ts';
import { Dictionary } from '../../../utils/types';
import { sequenceEither } from '../../../utils/either';

const defaultPrettierConfig: Options = {
	bracketSpacing: true,
	jsxBracketSameLine: true,
	parser: 'typescript',
	printWidth: 120,
	semi: true,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'all',
	useTabs: true,
};

export interface SerializeOptions {
	prettierConfig?: Options;
}

export const serialize = combineReader(
	serializeDocument,
	serializeDocument => (
		out: string,
		documents: Dictionary<OpenAPIV3.Document>,
		options: SerializeOptions = {},
	): Either<Error, FSEntity> =>
		pipe(
			documents,
			record.collect((name, document) => serializeDocument(name)(document)),
			sequenceEither,
			either.map(
				array.map(e => mapFS(e, content => format(content, options.prettierConfig || defaultPrettierConfig))),
			),
			either.map(content => directory(out, content)),
		),
);
