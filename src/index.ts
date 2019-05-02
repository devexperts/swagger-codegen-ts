import { Parser } from './parse';
import { fileName } from './utils/path.utils';
import { writeFile } from './write/file';
import * as fs from 'fs';
import { writeDirectory } from './write/directory';
import { record, string } from 'io-ts';
import { openAPIIO } from './validate/open-api-3';
import { PathReporter } from 'io-ts/lib/PathReporter';

export interface GenerateProps {
	/**
	 * Paths to OpenAPI spec files
	 */
	specs: string[];
	/**
	 * Path to output directory
	 * (gets clean before generating)
	 */
	out: string;
	/**
	 * Buffer to JSON converter
	 * @param buffer - File Buffer
	 */
	parser: Parser;
}

export const run = ({ out, specs, parser }: GenerateProps) => {
	const content = specs.reduce(
		(result, spec) => ({ ...result, [fileName(spec)]: parser(fs.readFileSync(spec)) }),
		{},
	);
	const validated = record(string, openAPIIO).decode(content);
	if (validated.isRight()) {
		writeDirectory({ path: out });
		writeFile({
			content: JSON.stringify(validated.value, undefined, '\t'),
			path: out,
			name: 'specs',
			extension: 'ts',
		});
	}
	if (validated.isLeft()) {
		console.log(PathReporter.report(validated));
	}
};
