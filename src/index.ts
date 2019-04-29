import { Parser } from './parse';
import { fileName } from './utils/path';
import { writeFile } from './write/file';
import * as fs from 'fs';
import { writeDirectory } from './write/directory';

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
	const content = JSON.stringify(
		specs.reduce((result, spec) => ({ ...result, [fileName(spec)]: parser(fs.readFileSync(spec)) }), {}),
		undefined,
		'\t',
	);
	writeDirectory({ path: out });
	writeFile({ content, path: out, name: 'specs', extension: 'ts' });
};
