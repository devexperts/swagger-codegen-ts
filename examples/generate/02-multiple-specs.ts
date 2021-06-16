import { generate } from '@devexperts/swagger-codegen-ts';
import * as path from 'path';
import { serialize as serializeOpenAPI3 } from '@devexperts/swagger-codegen-ts/dist/language/typescript/3.0';
import { OpenapiObjectCodec } from '@devexperts/swagger-codegen-ts/dist/schema/3.0/openapi-object';
import { array, either, taskEither } from 'fp-ts';
import { pipe } from 'fp-ts/function';

const cwd = path.resolve(__dirname, '../../test/specs/3.0');
const specs = ['nested/link-example.yaml', 'demo.yml'];

// Create a task for each input spec file
const tasks = pipe(
	specs,
	array.map(spec =>
		generate({
			cwd,
			spec: path.resolve(cwd, spec),
			out: path.resolve(__dirname, '../out'),
			language: serializeOpenAPI3,
			decoder: OpenapiObjectCodec,
		}),
	),
	// Notice how the sequence operation is used to run multiple tasks in parallel
	taskEither.sequenceArray,
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
