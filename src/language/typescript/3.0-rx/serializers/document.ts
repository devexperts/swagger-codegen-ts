import { OpenAPIV3 } from 'openapi-types';
import { directory, Directory, file } from '../../../../fs';
import { serializePathsObject } from './paths-object';
import { CLIENT_DIRECTORY, CLIENT_FILENAME } from '../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { Either } from 'fp-ts/lib/Either';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { serializeComponentsObject } from './components-object';
import * as nullable from '../../../../utils/nullable';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { sequenceEither } from '../../../../utils/either';

export const serializeDocument = combineReader(
	serializePathsObject,
	serializeComponentsObject,
	(serializePathsObject, serializeComponentsObject) => (
		name: string,
		document: OpenAPIV3.Document,
	): Either<Error, Directory> => {
		const paths = serializePathsObject(document.paths);
		const components = pipe(
			document.components,
			nullable.map(serializeComponentsObject),
		);
		const additional = pipe(
			nullable.compactNullables([components]),
			sequenceEither,
		);
		return combineEither(paths, additional, (paths, additional) =>
			directory(name, [
				directory(CLIENT_DIRECTORY, [file(`${CLIENT_FILENAME}.ts`, client)]),
				paths,
				...additional,
			]),
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
