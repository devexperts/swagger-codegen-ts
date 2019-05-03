import { Parser } from './parse';
import { fileName } from './utils/path.utils';
import { writeFile } from './write/file';
import * as fs from 'fs';
import { writeDirectory } from './write/directory';
import { record, string } from 'io-ts';
import { openAPIIO } from './validate/open-api-3';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { resolve } from 'path';

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
		Object.keys(validated.value).forEach(spec => {
			writeFile({
				content: `const ${spec} = ` + JSON.stringify(validated.value[spec], undefined, '\t'),
				path: out,
				name: spec,
				extension: 'ts',
			});
		});
	}
	if (validated.isLeft()) {
		console.log(PathReporter.report(validated));
		writeFile({
			content: 'const errors = ' + JSON.stringify(PathReporter.report(validated), undefined, '\t'),
			path: resolve(__dirname, '../'),
			name: 'errors',
			extension: 'ts',
		});
	}
};
