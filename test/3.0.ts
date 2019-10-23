import * as path from 'path';
import { serialize as serializeOpenAPI3 } from '../src/language/typescript/3.0-rx';
import { directory, write } from '../src/utils/fs';
import { Context } from '../src/language/typescript/3.0-rx/utils';
import * as nullable from '../src/utils/nullable';
import { pipe } from 'fp-ts/lib/pipeable';
import { array } from 'fp-ts';
import { OpenapiObject, OpenapiObjectCodec } from '../src/schema/3.0/openapi-object';
import * as $RefParser from 'json-schema-ref-parser';
import { reportIfFailed } from '../src/utils/io-ts';
import * as del from 'del';
import { getUnsafe, log, runUnsafe } from './utils';

const CWD = path.resolve(__dirname, 'specs', '3.0');
const OUT = path.resolve(__dirname, './out');

async function run() {
	log('Removing', OUT);
	await del(OUT);

	const $refs = await $RefParser.resolve(path.resolve(CWD, 'link-example.yaml'), {
		dereference: {
			circular: 'ignore',
		},
	});
	const specs: Record<string, OpenapiObject> = pipe(
		Object.entries($refs.values()),
		array.reduce({}, (acc, [fullPath, spec]) => {
			log('Decoding', fullPath);
			return {
				...acc,
				[path.relative(CWD, fullPath)]: getUnsafe(reportIfFailed(OpenapiObjectCodec.decode(spec))),
			};
		}),
	);

	const context: Context = {
		resolveRef: referenceObject => nullable.tryCatch(() => $refs.get(referenceObject.$ref)),
	};

	log('Writing', OUT);

	await write(OUT, getUnsafe(serializeOpenAPI3(context)(OUT, specs)));

	log('Done');
}

runUnsafe(run);
