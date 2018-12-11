import { SwaggerObject, TSwaggerObject } from './swagger';
import * as prettier from 'prettier';
import { map, read, TFSEntity, write } from './fs';
import { TSerializer } from './utils';
import * as fs from 'fs-extra';
import { fromNullable, Option } from 'fp-ts/lib/Option';
import * as path from 'path';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { head, last } from 'fp-ts/lib/Array';
import { Either, Right } from 'fp-ts/lib/Either';
import { ValidationError } from 'io-ts';
import { serialize } from './language/typescript';

const log = console.log.bind(console, '[SWAGGER-CODEGEN-TS]:');

type TJSON = {
	[key: string]: unknown;
};

export type TFileReader = (buffer: Buffer) => TJSON;

export type TGenerateOptions = {
	/**
	 * Paths to spec files
	 */
	pathsToSpec: string[];
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
	/**
	 * Buffer to JSON converter
	 * @param buffer - File Buffer
	 */
	fileReader: TFileReader;
};

const cwd = process.cwd();
const resolvePath = (p: string) => (path.isAbsolute(p) ? p : path.resolve(cwd, p));

const decode = (json: TJSON): Either<ValidationError[], TSwaggerObject> => {
	return SwaggerObject.decode(json);
};

const serializeDecode = (serializer: TSerializer) => async (
	decoded: Right<ValidationError[], TSwaggerObject>,
	out: string,
): Promise<TFSEntity> => serializer(path.basename(out), decoded.value);

const getPrettierConfig = async (pathToPrettierConfig?: string): Promise<Option<prettier.Options>> =>
	fromNullable(
		await prettier.resolveConfig(
			fromNullable(pathToPrettierConfig)
				.map(resolvePath)
				.getOrElseL(() => path.resolve(__dirname, '../.prettierrc')),
		),
	);

const formatSerialized = (serialized: TFSEntity, prettierConfig: Option<prettier.Options>): TFSEntity =>
	prettierConfig.map(config => map(serialized, content => prettier.format(content, config))).getOrElse(serialized);

const writeFormatted = (out: string, formatted: TFSEntity) => write(path.dirname(out), formatted);

export const generate = async (options: TGenerateOptions): Promise<void> => {
	const out = resolvePath(options.out);

	if (!(await fs.pathExists(out))) {
		await fs.mkdirp(out);
	}
	const outStats = await fs.stat(out);
	if (!outStats.isDirectory()) {
		throw new Error('OUT is not directory');
	}
	const prettierConfig = await getPrettierConfig(options.pathToPrettierConfig);
	const serializer = serializeDecode(serialize);

	for (const pathToFile of options.pathsToSpec) {
		const pathToSpec = resolvePath(pathToFile);
		const buffer = await read(pathToSpec, cwd);
		const dirName = head(buffer.fileName.split('.')).getOrElse(buffer.fileName);
		const apiOut = path.resolve(out, `./${dirName}`);
		await fs.mkdir(apiOut);
		const json = options.fileReader(buffer.buffer);
		const decoded = decode(json);
		if (decoded.isLeft()) {
			const report = PathReporter.report(decoded);
			const lastReport = last(report);
			log(lastReport.getOrElse('Invalid spec'));
			ThrowReporter.report(decoded);
			return;
		}
		const seralized = await serializer(decoded, apiOut);
		const formatted = formatSerialized(seralized, prettierConfig);
		writeFormatted(apiOut, formatted);
	}
};
