import { directory, Directory, file } from '../../../../utils/fs';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeDefinitions } from './definitions-object';
import { serializePaths } from './paths-object';
import { CLIENT_DIRECTORY, CLIENT_FILENAME, UTILS_DIRECTORY, UTILS_FILENAME } from '../../common/utils';
import { Either } from 'fp-ts/lib/Either';
import { array, option } from 'fp-ts';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { SwaggerObject } from '../../../../schema/2.0/swagger-object';

export const serializeSwaggerObject = (name: string, swaggerObject: SwaggerObject): Either<Error, Directory> => {
	const definitions = pipe(
		swaggerObject.definitions,
		option.map(serializeDefinitions),
	);
	const additional = pipe(
		[definitions],
		array.compact,
		sequenceEither,
	);
	const paths = serializePaths(swaggerObject.paths, swaggerObject.parameters);
	return combineEither(additional, paths, (additional, paths) => {
		return directory(name, [
			directory(CLIENT_DIRECTORY, [file(`${CLIENT_FILENAME}.ts`, client)]),
			directory(UTILS_DIRECTORY, [file(`${UTILS_FILENAME}.ts`, utils)]),
			...additional,
			paths,
		]);
	});
};

const client = `
	import { LiveData } from '@devexperts/rx-utils/dist/rd/live-data.utils';
	import { Errors, mixed } from 'io-ts';
	import { report } from '../utils/utils';
	import { left } from 'fp-ts/lib/Either';

	export interface APIRequest {
		readonly url: string;
		readonly query?: object;
		readonly body?: unknown;
	};

	export interface FullAPIRequest extends APIRequest {
		readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
	};
	
	export interface APIClient {
		readonly request: (request: FullAPIRequest) => LiveData<Error, mixed>;
	};
	
	export class ResponseValidationError extends Error {
		static create(errors: Errors): ResponseValidationError {
			return new ResponseValidationError(errors);
		} 
	
		constructor(readonly errors: Errors) {
			super(report(left(errors)).toString());
			this.name = 'ResponseValidationError';
			Object.setPrototypeOf(this, ResponseValidationError);
		}
	}
`;

const utils = `
	import { Type, success, identity, Errors, Validation, Context, ValidationError } from 'io-ts';
	import { fold } from 'fp-ts/lib/Either';

	export const unknownType = new class UnknownType extends Type<unknown> {
		readonly _tag: 'UnknownType' = 'UnknownType';

		constructor() {
			super('unknownType', (_: unknown): _ is unknown => true, success, identity);
		}
	}();

	function getMessage(e: ValidationError) {
		return e.message !== undefined ? e.message : 
			createMessage(e.context)
			+ '\\n in context: \\n' 
			+ getContextPath(e.context);
	}

	function createMessage(context: Context) {
		return (
			'\\n Received: \\n  ' +
			JSON.stringify(context[context.length - 1].actual) +
			'\\n expected: \\n  ' +
			context[context.length - 1].type.name +
			'\\n in field \\n  ' +
			context[context.length - 1].key
		);
	}

	function getContextPath(context: Context) {
		return context
			.map(function(cEntry, index) {
				const padding = new Array(index * 2 + 2).fill(' ').join('');
				return (
					padding + cEntry.key + (index > 0 ? ': ' : '') + cEntry.type.name.replace(/([,{])/g, '$1 \\n' + padding)
				);
			}) 
			.join(' -> \\n');
	}

	function fail(es: Errors) {
		return es.map(getMessage);
	}

	function ok() {
		return ['No errors!'];
	}

	export const report: (validation: Validation<unknown>) => string[] = fold(fail, ok);
`;
