import { serialize as serializeSwagger2 } from '../src/language/typescript/2.0';
import * as path from 'path';
import { SwaggerObject } from '../src/schema/2.0/swagger-object';
import { generate } from '../src';
import { Either, toError } from 'fp-ts/lib/Either';
import { serialize as serializeOpenAPI3 } from '../src/language/typescript/3.0';
import { serialize as serializeAsyncAPI } from '../src/language/typescript/asyncapi-2.0.0';
import { serialize as serializeSketch } from '../src/language/typescript/sketch-121';
import { OpenapiObjectCodec } from '../src/schema/3.0/openapi-object';
import * as del from 'del';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, taskEither } from 'fp-ts';
import { identity } from 'fp-ts/lib/function';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { FileFormatCodec } from '../src/schema/sketch-121/file-format';
import { createNameStorage } from '../src/language/typescript/sketch-121/utils';
import { AsyncAPIObjectCodec } from '../src/schema/asyncapi-2.0.0/asyncapi-object';

const cwd = path.resolve(__dirname);
const out = path.resolve(cwd, 'out');

const test1 = generate({
	spec: path.resolve(__dirname, 'specs/2.0/json/swagger.json'),
	out,
	language: serializeSwagger2,
	decoder: SwaggerObject,
});

const test2 = generate({
	spec: path.resolve(__dirname, 'specs/2.0/yaml/demo.yml'),
	out,
	language: serializeSwagger2,
	decoder: SwaggerObject,
});

const test3 = generate({
	spec: path.resolve(__dirname, 'specs/3.0/demo.yml'),
	out,
	language: serializeOpenAPI3,
	decoder: OpenapiObjectCodec,
});

const test4 = generate({
	spec: path.resolve(__dirname, 'specs/asyncapi-2.0.0/streetlights-api.yml'),
	out,
	language: serializeAsyncAPI,
	decoder: AsyncAPIObjectCodec,
});

const test5 = generate({
	spec: path.resolve(__dirname, 'specs/sketch/demo.sketch'),
	out,
	language: () => serializeSketch({ nameStorage: createNameStorage() }),
	decoder: FileFormatCodec,
});

const clean = taskEither.tryCatch(async () => await del(out), toError);

const rethrow = (e: unknown): never => {
	throw e;
};
const getUnsafe: <E, A>(ea: Either<unknown, A>) => A = either.fold(rethrow, identity);
const terminateUnsafe = (e: unknown) => {
	console.error(e);
	process.exit(1);
};
const runUnsafe = (task: TaskEither<unknown, unknown>): void => {
	task()
		.then(getUnsafe)
		.catch(terminateUnsafe);
};

const program = pipe(
	clean,
	taskEither.chain(() => test1),
	taskEither.chain(() => test2),
	taskEither.chain(() => test3),
	taskEither.chain(() => test4),
	taskEither.chain(() => test5),
);

runUnsafe(program);
