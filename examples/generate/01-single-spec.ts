import { generate } from '@devexperts/swagger-codegen-ts';
import * as path from 'path';
import { serialize as serializeOpenAPI3 } from '@devexperts/swagger-codegen-ts/dist/language/typescript/3.0';
import { OpenapiObjectCodec } from '@devexperts/swagger-codegen-ts/dist/schema/3.0/openapi-object';
import { either } from 'fp-ts';

const cwd = path.resolve(__dirname, '../../test/specs/3.0');

// Note that the `generate` function does not generate immediately but returns a `TaskEither`
// see: https://dev.to/ryanleecode/practical-guide-to-fp-ts-p3-task-either-taskeither-2hpl
const codegenTask = generate({
	cwd,
	spec: path.resolve(cwd, 'petstore.yaml'),
	out: path.resolve(__dirname, '../out'),
	language: serializeOpenAPI3,
	decoder: OpenapiObjectCodec,
});

// The result of a `TaskEither` invocation is a promise that is always resolved to an `Either`
// Make sure that Either's left side is handled, otherwise the errors would be silently ignored.
codegenTask().then(
	either.fold(
		error => {
			console.error('Code generation failed', error);
			process.exit(1);
		},
		() => {
			console.log('Generated successfully');
		},
	),
);
