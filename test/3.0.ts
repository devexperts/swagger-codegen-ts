import * as path from 'path';
import * as SwaggerParser from 'swagger-parser';
import { serialize } from '../src/language/typescript/3.0-rx';
import { OpenAPI, OpenAPIV3 } from 'openapi-types';
import { write } from '../src/utils/fs';
import { Either, fold } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
import { Context } from '../src/language/typescript/3.0-rx/utils';
import * as nullable from '../src/utils/nullable';

const CWD = path.resolve(__dirname, 'specs', '3.0');
const OUT = path.resolve(__dirname, './out');

async function run() {
	const pathToSpec = path.resolve(CWD, 'link-example.yaml');
	const refs = await SwaggerParser.resolve(pathToSpec, { dereference: { circular: 'ignore' } });

	const specs = Object.entries(refs.values()).reduce((acc, [fullPath, spec]) => {
		if (!isV3(spec)) {
			throw new Error('Document should be an OpenAPIV3.Document');
		}
		return { ...acc, [path.relative(CWD, fullPath)]: spec };
	}, {});

	const context: Context = {
		resolveRef: referenceObject => nullable.tryCatch(() => refs.get(referenceObject.$ref)),
	};

	await write(OUT, getUnsafe(serialize(context)(OUT, specs)));
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
