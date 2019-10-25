import { serialize as serializeSwagger2 } from '../src/language/typescript/2.0-rx';
import * as path from 'path';
import { SwaggerObject } from '../src/schema/2.0/swagger-object';
import { generate } from '../src';
import { Either, right } from 'fp-ts/lib/Either';
import { serialize as serializeOpenAPI3 } from '../src/language/typescript/3.0-rx';
import { OpenapiObjectCodec } from '../src/schema/3.0/openapi-object';
import * as del from 'del';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, option, taskEither } from 'fp-ts';
import { identity } from 'fp-ts/lib/function';
import { TaskEither } from 'fp-ts/lib/TaskEither';

const cwd = path.resolve(__dirname);
const out = path.resolve(cwd, 'out');

const test1 = generate({
	spec: path.resolve(__dirname, 'specs/json/swagger.json'),
	out,
	language: (out, documents) => right(serializeSwagger2(out, documents)),
	decoder: SwaggerObject,
});

const test2 = generate({
	spec: path.resolve(__dirname, 'specs/yaml/swagger.yml'),
	out,
	language: (out, documents) => right(serializeSwagger2(out, documents)),
	decoder: SwaggerObject,
});

const test3 = generate({
	spec: path.resolve(__dirname, 'specs/3.0/nested/link-example.yaml'),
	out,
	language: (out, documents, resolveRef) =>
		serializeOpenAPI3({
			resolveRef: referenceObject => option.toUndefined(option.fromEither(resolveRef(referenceObject.$ref))),
		})(out, documents),
	decoder: OpenapiObjectCodec,
});

const clean = taskEither.tryCatch(async () => await del(out), identity);

const rethrow = (e: unknown): never => {
	throw e;
};
const getUnsafe: <A>(ea: Either<unknown, A>) => A = either.fold(rethrow, identity);
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
);

runUnsafe(program);
