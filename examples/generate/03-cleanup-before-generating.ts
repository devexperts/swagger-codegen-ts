import { generate } from '@devexperts/swagger-codegen-ts';
import * as path from 'path';
import { serialize as serializeOpenAPI3 } from '@devexperts/swagger-codegen-ts/dist/language/typescript/3.0';
import { OpenapiObjectCodec } from '@devexperts/swagger-codegen-ts/dist/schema/3.0/openapi-object';
import { taskEither } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { remove } from 'fs-extra';
import { identity } from 'io-ts';

const cwd = path.resolve(__dirname, '../../test/specs/3.0');
const out = path.resolve(__dirname, '../out');

const cleanTask = taskEither.tryCatch(() => remove(out), identity);

const generateTask = generate({
	cwd,
	spec: 'file-and-text.yml',
	out,
	language: serializeOpenAPI3,
	decoder: OpenapiObjectCodec,
});

pipe(
	[cleanTask, generateTask],
	taskEither.sequenceSeqArray,
	taskEither.match(
		error => {
			console.error(error);
			process.exit(1);
		},
		() => {
			console.log('Generated successfully');
		},
	),
)();
