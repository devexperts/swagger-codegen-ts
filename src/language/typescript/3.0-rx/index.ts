import { serializeDocument } from './serializers/document';

export { serializeDocument } from './serializers/document';

import { OpenAPIV3 } from 'openapi-types';
import { format, Options } from 'prettier';
import { FSEntity, map as mapFS } from '../../../fs';
import { Either, map as mapEither } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { Dereference } from './utils';

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

export const serialize = (
	document: OpenAPIV3.Document,
	dereference: Dereference,
	options: SerializeOptions = {},
): Either<Error, FSEntity> =>
	pipe(
		document,
		serializeDocument(dereference),
		mapEither(e => mapFS(e, content => format(content, options.prettierConfig || defaultPrettierConfig))),
	);
