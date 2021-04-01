import { serialize as serializeSwagger2 } from '../src/language/typescript/2.0';
import * as path from 'path';
import { SwaggerObject } from '../src/schema/2.0/swagger-object';
import { generate } from '../src';
import { Either } from 'fp-ts/lib/Either';
import { serialize as serializeOpenAPI3 } from '../src/language/typescript/3.0';
import { serialize as serializeAsyncAPI } from '../src/language/typescript/asyncapi-2.0.0';
import { serialize as serializeSketch } from '../src/language/typescript/sketch-121';
import { OpenapiObjectCodec } from '../src/schema/3.0/openapi-object';
import * as del from 'del';
import { either } from 'fp-ts';
import { identity } from 'fp-ts/lib/function';
import { FileFormatCodec } from '../src/schema/sketch-121/file-format';
import { createNameStorage } from '../src/language/typescript/sketch-121/utils';
import { AsyncAPIObjectCodec } from '../src/schema/asyncapi-2.0.0/asyncapi-object';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { Task } from 'fp-ts/lib/Task';

const cwd = path.resolve(__dirname);
const out = path.resolve(cwd, 'out');

const rethrow = (e: unknown): never => {
	throw e;
};
const getUnsafe: <E, A>(ea: Either<unknown, A>) => A = either.fold(rethrow, identity);
const unsafe = <E, A>(task: TaskEither<E, A>): Task<A> => () => task().then(getUnsafe);

describe('codegen', () => {
	beforeAll(async () => await del(out));

	it(
		'specs/2.0/json/swagger.json',
		unsafe(
			generate({
				spec: path.resolve(__dirname, 'specs/2.0/json/swagger.json'),
				out,
				language: serializeSwagger2,
				decoder: SwaggerObject,
			}),
		),
	);

	it(
		'specs/2.0/yaml/demo.yml',
		unsafe(
			generate({
				spec: path.resolve(__dirname, 'specs/2.0/yaml/demo.yml'),
				out,
				language: serializeSwagger2,
				decoder: SwaggerObject,
			}),
		),
	);

	it(
		'specs/3.0/demo.yml',
		unsafe(
			generate({
				spec: path.resolve(__dirname, 'specs/3.0/demo.yml'),
				out,
				language: serializeOpenAPI3,
				decoder: OpenapiObjectCodec,
			}),
		),
	);

	it(
		'specs/3.0/file-and-text.yml',
		unsafe(
			generate({
				spec: path.resolve(__dirname, 'specs/3.0/file-and-text.yml'),
				out,
				language: serializeOpenAPI3,
				decoder: OpenapiObjectCodec,
			}),
		),
	);

	it(
		'specs/asyncapi-2.0.0/streetlights-api.yml',
		unsafe(
			generate({
				spec: path.resolve(__dirname, 'specs/asyncapi-2.0.0/streetlights-api.yml'),
				out,
				language: serializeAsyncAPI,
				decoder: AsyncAPIObjectCodec,
			}),
		),
	);

	it(
		'specs/sketch/demo.sketch',
		unsafe(
			generate({
				spec: path.resolve(__dirname, 'specs/sketch/demo.sketch'),
				out,
				language: () => serializeSketch({ nameStorage: createNameStorage() }),
				decoder: FileFormatCodec,
			}),
		),
	);
});
