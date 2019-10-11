import * as path from 'path';
import * as SwaggerParser from 'swagger-parser';
import { serialize } from '../src/language/typescript/3.0-rx';
import { OpenAPI, OpenAPIV3 } from 'openapi-types';
import { write } from '../src/fs';
import { Either, fold } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
import { toUndefined, tryCatch } from 'fp-ts/lib/Option';

const cwd = path.resolve(__dirname);
async function run() {
	const pathToSpec = path.resolve(cwd, './specs/3.0/link-example.yaml');
	const parser = new SwaggerParser();
	await parser.validate(pathToSpec, { dereference: { circular: 'ignore' } });
	if (!isV3(parser.api)) {
		throw new Error('Document should be an OpenAPIV3.Document');
	}
	await write(
		path.resolve(cwd, './out'),
		getUnsafe(serialize(parser.api, ref => toUndefined(tryCatch(() => parser.$refs.get(ref.$ref))))),
	);
}

const supported = ['3.0.0', '3.0.1', '3.0.2'];
const isV3 = (document: OpenAPI.Document): document is OpenAPIV3.Document => {
	const openapi = (document as any)['openapi'];
	return supported.includes(openapi);
};

run().catch(e => {
	console.error(e);
	process.exit(1);
});

const getUnsafe: <E, A>(e: Either<E, A>) => A = fold(e => {
	throw e;
}, identity);
