import { SerializedPathParameter } from './data/serialized-path-parameter';
import { unless } from '../../../utils/string';
import { Options } from 'prettier';
import { fromString } from '../../../utils/ref';
import { ReferenceObject } from '../../../schema/3.0/reference-object';
import { Kind } from '../../../utils/types';

export const SUCCESSFUL_CODES = ['200', '201', 'default'];
export const CONTROLLERS_DIRECTORY = 'controllers';
export const DEFINITIONS_DIRECTORY = 'definitions';
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

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

export const pathsRef = fromString('#/paths');

export interface Context {
	readonly resolveRef: (referenceObject: ReferenceObject) => unknown;
}

export const getKindValue = (kind: Kind, value: string): string => {
	switch (kind) {
		case 'HKT': {
			return `HKT<F, ${value}>`;
		}
		case '*': {
			return `Kind<F, ${value}>`;
		}
		case '* -> *': {
			return `Kind2<F, Error, ${value}>`;
		}
	}
};

export const getControllerName = (name: string): string => `${name}Controller`;
