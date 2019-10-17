import { getRelativeRoot } from '../common/utils';
import { ParsedRef } from '../../../utils/ref';

export const EMPTY_REFS: ParsedRef[] = [];

export const getRelativeRefPath = (cwd: string, refBlockName: string, refFileName: string): string =>
	`${getRelativeRoot(cwd)}/${refBlockName}/${refFileName}`;
export const getRelativeOutRefPath = (
	cwd: string,
	blockName: string,
	outFileName: string,
	refFileName: string,
): string => `${getRelativeRoot(cwd)}/../${outFileName}/${blockName}/${refFileName}`;
