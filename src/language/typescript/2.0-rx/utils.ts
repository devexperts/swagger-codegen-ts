import * as path from 'path';

export const SUCCESSFUL_CODES = ['200', '201', 'default'];
export const ROOT_DIRECTORY = '.';
export const CONTROLLERS_DIRECTORY = 'controllers';
export const DEFINITIONS_DIRECTORY = 'definitions';
export const CLIENT_DIRECTORY = 'client';
export const CLIENT_FILENAME = 'client';
export const UTILS_DIRECTORY = 'utils';
export const UTILS_FILENAME = 'utils';
export const EMPTY_REFS: string[] = [];

export const getIOName = (name: string): string => `${name}IO`;

const getRelativeRoot = (cwd: string) => path.relative(cwd, ROOT_DIRECTORY);
export const getRelativeRefPath = (cwd: string, refBlockName: string, refFileName: string): string =>
	`${getRelativeRoot(cwd)}/${refBlockName}/${refFileName}`;
export const getRelativeOutRefPath = (
	cwd: string,
	blockName: string,
	outFileName: string,
	refFileName: string,
): string => `${getRelativeRoot(cwd)}/../${outFileName}/${blockName}/${refFileName}`;
export const getRelativeClientPath = (cwd: string): string =>
	`${getRelativeRoot(cwd)}/${CLIENT_DIRECTORY}/${CLIENT_FILENAME}`;
export const getRelativeUtilsPath = (cwd: string): string =>
	`${getRelativeRoot(cwd)}/${UTILS_DIRECTORY}/${UTILS_FILENAME}`;
