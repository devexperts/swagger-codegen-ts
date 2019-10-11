import { OpenAPIV3 } from 'openapi-types';
import { directory, Directory, file } from '../../../../fs';
import { serializePathsObject } from './paths-object';
import { CLIENT_DIRECTORY, CLIENT_FILENAME } from '../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { Either, map } from 'fp-ts/lib/Either';
import { Dereference } from '../utils';

export const serializeDocument = (dereference: Dereference) => (
	document: OpenAPIV3.Document,
): Either<Error, Directory> => {
	return pipe(
		serializePathsObject(dereference, document.paths),
		map(paths =>
			directory(`${document.info.title}-${document.info.version}`, [
				directory(CLIENT_DIRECTORY, [file(`${CLIENT_FILENAME}.ts`, client)]),
				paths,
			]),
		),
	);
};

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
