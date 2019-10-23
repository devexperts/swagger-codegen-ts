import { serializeDocument } from './serializers/document';

export { serializeDocument } from './serializers/document';

import { format, Options } from 'prettier';
import { directory, fromRef, FSEntity, map as mapFS } from '../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { either, record } from 'fp-ts';
import { Dictionary } from '../../../utils/types';
import { sequenceEither } from '../../../utils/either';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { clientRef } from './utils';
import { OpenapiObject } from '../../../schema/3.0/openapi-object';

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
		documents: Dictionary<OpenapiObject>,
		options: SerializeOptions = {},
	): Either<Error, FSEntity> => {
		const serialized = pipe(
			documents,
			record.collect(serializeDocument),
			sequenceEither,
		);
		return pipe(
			combineEither(serialized, clientRef, (serialized, clientRef) =>
				directory(out, [...serialized, fromRef(clientRef, '.ts', client)]),
			),
			either.map(e => mapFS(e, content => format(content, options.prettierConfig || defaultPrettierConfig))),
		);
	},
);

const client = `
	import { left } from 'fp-ts/lib/Either';
	import { Errors } from 'io-ts';
	import { PathReporter } from 'io-ts/lib/PathReporter';
	import { LiveData } from '@devexperts/rx-utils/dist/rd/live-data.utils'; 
	
	export interface APIRequest {
		readonly url: string;
		readonly query?: object;
		readonly body?: unknown;
	}
	
	export interface FullAPIRequest extends APIRequest {
		readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
	}
	
	export interface APIClient {
		readonly request: (request: FullAPIRequest) => LiveData<Error, unknown>
	}
	
	export class ResponseValidationError extends Error {
		static create(errors: Errors): ResponseValidationError {
			return new ResponseValidationError(errors);
		}
	
		constructor(readonly errors: Errors) {
			super(PathReporter.report(left(errors)).join('\\n\\n')); 
			this.name = 'ResponseValidationError';
			Object.setPrototypeOf(this, ResponseValidationError);
		}
	}
`;
