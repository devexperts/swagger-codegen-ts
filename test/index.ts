import { serialize } from '../src/language/typescript/2.0-rx';
import * as path from 'path';
import * as del from 'del';
import { SwaggerObject } from '../src/schema/2.0/swagger-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { array } from 'fp-ts';
import { getUnsafe, log, runUnsafe } from './utils';
import { reportIfFailed } from '../src/utils/io-ts';
import { write } from '../src/utils/fs';
import * as $RefParser from 'json-schema-ref-parser';

const OUT = path.resolve(__dirname, './out');
const CWD = path.resolve(__dirname, 'specs');

async function run() {
	log('Removing', OUT);
	await del(OUT);

	const $refs = await $RefParser.resolve(path.resolve(CWD, 'yaml/swagger.yml'), {
		dereference: {
			circular: 'ignore',
		},
	});

	const specs: Record<string, SwaggerObject> = pipe(
		Object.entries($refs.values()),
		array.reduce({}, (acc, [fullPath, spec]) => {
			log('Decoding', fullPath);
			return {
				...acc,
				[path.relative(CWD, fullPath)]: getUnsafe(reportIfFailed(SwaggerObject.decode(spec))),
			};
		}),
	);

	log('Writing', OUT);

	await write(OUT, serialize(OUT, specs));

	log('Done');
}

runUnsafe(run);
