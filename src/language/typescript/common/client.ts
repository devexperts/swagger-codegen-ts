import { fromString } from '../../../utils/ref';
import { fromRef } from '../../../utils/fs';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';

export const clientRef = fromString('#/client/client');

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

export const clientFile = pipe(
	clientRef,
	either.map(ref => fromRef(ref, '.ts', client)),
);
