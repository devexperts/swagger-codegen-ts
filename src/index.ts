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
	 * Path to json spec
	 */
	pathToSpec: string;
	/**
	 * Path to output directory (should be empty)
	 */
	out: string;
	/**
	 * Spec serializer
	 */
	serialize: TSerializer;
	/**
	 * Path to prettier config
	 */
	pathToPrettierConfig?: string;
};

const cwd = process.cwd();
const resolvePath = (p: string) => (path.isAbsolute(p) ? p : path.resolve(cwd, p));

export async function generate(options: TGenerateOptions): Promise<void> {
	const { serialize, pathToPrettierConfig } = options;
	const out = resolvePath(options.out);
	const pathToSpec = resolvePath(options.pathToSpec);
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
	const serialized = serialize(path.basename(out), decoded.value);
	log('Running prettier');
	const prettierConfig = fromNullable(
		await prettier.resolveConfig(
			fromNullable(pathToPrettierConfig)
				.map(resolvePath)
				.getOrElseL(() => path.resolve(__dirname, '../.prettierrc')),
		),
	);
	const formatted = prettierConfig
		.map(config => map(serialized, content => prettier.format(content, config)))
		.getOrElse(serialized);
	log('Writing to', out);
	await write(path.dirname(out), formatted);
	log('Done.');
}
