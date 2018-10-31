import { SwaggerObject } from './swagger';
import * as prettier from 'prettier';
import { map, write } from './fs';
import { TSerializer } from './utils';
import * as fs from 'fs-extra';
import { fromNullable } from 'fp-ts/lib/Option';
import * as path from 'path';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { last } from 'fp-ts/lib/Array';

const log = console.log.bind(console, '[SWAGGER-CODEGEN-TS]:');

export type TGenerateOptions = {
	/**
	 * Absolute path to json spec
	 */
	pathToSpec: string;
	/**
	 * Absolute path to output directory (should be empty)
	 */
	out: string;
	/**
	 * Spec serializer
	 */
	serialize: TSerializer;
};

export async function generate(options: TGenerateOptions): Promise<void> {
	const { pathToSpec, out, serialize } = options;
	log('Reading spec from', pathToSpec);
	const buffer = await fs.readFile(pathToSpec);
	log('Parsing spec');
	const json = JSON.parse(buffer.toString());
	log('Decoding spec');
	const decoded = SwaggerObject.decode(json);
	if (decoded.isLeft()) {
		const report = PathReporter.report(decoded);
		const lastReport = last(report);
		log(lastReport.getOrElse('Invalid spec'));
		ThrowReporter.report(decoded);
		return;
	}
	log('Serializing spec');
	const specName = path.dirname(out);
	const serialized = serialize(specName, decoded.value);
	log('Running prettier');
	const prettierConfig = fromNullable(await prettier.resolveConfig(path.resolve(__dirname, '../.prettierrc')));
	const formatted = prettierConfig
		.map(config => map(serialized, content => prettier.format(content, config)))
		.getOrElse(serialized);
	log('Writing to', out);
	const destination = path.basename(out);
	if (!fs.pathExists(destination)) {
		await fs.mkdirp(destination);
		await write(destination, formatted);
	}
	log('Done.');
}
