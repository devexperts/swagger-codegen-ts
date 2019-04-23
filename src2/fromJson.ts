import { isJson } from './utils';
import * as fs from 'fs-extra';
import * as path from 'path';

type objectType = {
	[key: string]: Buffer;
};

const cwd = process.cwd();

const resolvePath = (p: string) => (path.isAbsolute(p) ? p : path.resolve(cwd, p));
const getFileName = (p: string) => path.basename(resolvePath(p));
const getObjValue = (p: string) => (isJson(p) ? JSON.parse(fs.readFileSync(p).toString()) : {});

export const fromJSON = (pathsToSpec: string[]) =>
	pathsToSpec
		.map((pathToSpec: string) => ({ [getFileName(pathToSpec)]: getObjValue(pathToSpec) }))
		.reduce((prevObj: objectType, nextObj: objectType) => ({ ...prevObj, ...nextObj }));
