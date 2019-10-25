import * as path from 'path';
import { SerializedPathParameter } from './data/serialized-path-parameter';
import { unless } from '../../../utils/string';
import { Options } from 'prettier';

export const SUCCESSFUL_CODES = ['200', '201', 'default'];
export const ROOT_DIRECTORY = '.';
export const CONTROLLERS_DIRECTORY = 'controllers';
export const DEFINITIONS_DIRECTORY = 'definitions';
export const CLIENT_DIRECTORY = 'client';
export const CLIENT_FILENAME = 'client';
export const UTILS_DIRECTORY = 'utils';
export const UTILS_FILENAME = 'utils';
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export const getRelativeRoot = (cwd: string) => path.relative(cwd, ROOT_DIRECTORY);
export const getRelativeClientPath = (cwd: string): string =>
	`${getRelativeRoot(cwd)}/${CLIENT_DIRECTORY}/${CLIENT_FILENAME}`;

const INVALID_NAMES = ['Error', 'Promise', 'PromiseLike', 'Array', 'ArrayLike', 'Function', 'Object'];
export const getTypeName = (name: string): string => (INVALID_NAMES.includes(name) ? `${name}Type` : name);
export const getIOName = (name: string): string => `${name}IO`;
export const getURL = (pattern: string, pathParameters: SerializedPathParameter[]): string =>
	pathParameters.reduce(
		(acc, p) => acc.replace(`{${p.name}}`, `\$\{encodeURIComponent(${p.io}.toString())\}`),
		`\`${pattern}\``,
	);
export const getJSDoc = (lines: string[]): string =>
	unless(
		lines.length === 0,
		`/** 
			 ${lines.map(line => `* ${line}`).join('\n')}
		 */`,
	);
export const defaultPrettierConfig: Options = {
	bracketSpacing: true,
	jsxBracketSameLine: true,
	parser: 'typescript',
	printWidth: 120,
	semi: true,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'all',
	useTabs: true,
};

export interface SerializeOptions {
	prettierConfig?: Options;
}
