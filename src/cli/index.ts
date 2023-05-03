const yargs = require('yargs'); // eslint-disable-line
const { hideBin } = require('yargs/helpers'); // eslint-disable-line
import { array, either, taskEither } from 'fp-ts';
import { serialize as serializeOpenAPI3 } from '../language/typescript/3.0';
import { generate, Language } from '../index';
import { Decoder } from 'io-ts';
import { Reader } from 'fp-ts/lib/Reader';
import { ResolveRefContext } from '../utils/ref';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import * as $RefParser from 'json-schema-ref-parser';
import * as path from 'path';
import { pipe } from 'fp-ts/lib/pipeable';
import { OpenapiObject, OpenapiObjectCodec } from '../schema/3.0/openapi-object';
import { SwaggerObject } from '../schema/2.0/swagger-object';
import { serialize as serializeSwagger } from '../language/typescript/2.0';
import { AsyncAPIObject, AsyncAPIObjectCodec } from '../schema/asyncapi-2.0.0/asyncapi-object';
import { serialize as serializeAsyncApi } from '../language/typescript/asyncapi-2.0.0';

const options = yargs(hideBin(process.argv))
	.usage('swagger-codegen-ts -o <output_path> [flags] <path/to/spec.yaml>...')
	.option('baseDir', {
		alias: 'b',
		describe: 'base directory for <specs> and <outDir> paths',
		defaultDescription: 'current working dir',
	})
	.option('outDir', {
		alias: 'o',
		describe: 'path to the output files, relative to the <baseDir>',
	})
	.positional('', {
		array: true,
		type: 'string',
		describe: 'list of OpenAPI or YAML specifications, paths relative to the <baseDir>',
	}).argv;

const tasks = pipe(
	options._,
	array.map((spec: string) => (options.baseDir ? path.resolve(options.baseDir, spec) : spec)),
	array.map(spec =>
		pipe(
			detectCodec(spec),
			taskEither.chain(codec =>
				generate({
					...(codec as any),
					cwd: options.baseDir || process.cwd(),
					spec,
					out: options.outDir,
				}),
			),
		),
	),
	array.array.sequence(taskEither.taskEither),
);

tasks().then(
	either.fold(
		error => {
			console.error(error);
			process.exit(1);
		},
		() => {
			console.log('Generated successfully');
		},
	),
);

export interface DetectedCodec<A> {
	readonly decoder: Decoder<unknown, A>;
	readonly language: Reader<ResolveRefContext, Language<A>>;
}

const supportedCodecs = [
	{
		decoder: OpenapiObjectCodec,
		language: serializeOpenAPI3,
	},
	{
		decoder: SwaggerObject,
		language: serializeSwagger,
	},
	{
		decoder: AsyncAPIObjectCodec,
		language: serializeAsyncApi,
	},
];

function detectCodec(
	spec: string,
): TaskEither<Error, DetectedCodec<OpenapiObject> | DetectedCodec<SwaggerObject> | DetectedCodec<AsyncAPIObject>> {
	return pipe(
		taskEither.tryCatch(
			() =>
				$RefParser.resolve(spec, {
					resolve: {
						external: false,
						http: false,
					},
				}),
			either.toError,
		),
		taskEither.map(refs => Object.entries(refs.values())),
		taskEither.filterOrElse(
			i => i.length === 1,
			() => new Error('Could not detect the schema type for ' + spec),
		),
		taskEither.chain(([[, schema]]) =>
			pipe(
				supportedCodecs,
				array.findFirst(c => either.isRight<unknown, unknown>(c.decoder.decode(schema))),
				taskEither.fromOption(() => new Error('Could not detect the schema type for ' + spec)),
			),
		),
	);
}
