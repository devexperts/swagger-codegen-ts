import { directory, Directory, fromRef } from '../../../../utils/fs';
import { serializePathsObject } from './paths-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { Either } from 'fp-ts/lib/Either';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { serializeComponentsObject } from './components-object';
import * as nullable from '../../../../utils/nullable';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { sequenceEither } from '../../../../utils/either';
import { fromString } from '../../../../utils/ref';
import { either } from 'fp-ts';
import { applyTo } from '../../../../utils/function';
import { OpenapiObject } from '../../../../schema/3.0/openapi-object';
import { clientRef } from '../utils';

export const serializeDocument = combineReader(
	serializePathsObject,
	serializePathsObject => (name: string, document: OpenapiObject): Either<Error, Directory> => {
		const pathsRef = fromString('#/paths');
		const componentsRef = fromString('#/components');

		const paths = pipe(
			pathsRef,
			either.map(serializePathsObject),
			either.chain(applyTo(document.paths)),
		);

		const components = pipe(
			document.components,
			nullable.map(components =>
				pipe(
					componentsRef,
					either.map(serializeComponentsObject),
					either.chain(applyTo(components)),
				),
			),
		);

		const additional = pipe(
			nullable.compactNullables([components]),
			sequenceEither,
		);
		return combineEither(paths, additional, clientRef, (paths, additional, clientRef) =>
			directory(name, [paths, ...additional, fromRef(clientRef, '.ts', client)]),
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
