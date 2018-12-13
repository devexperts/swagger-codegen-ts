#!/usr/bin/env node

import * as path from 'path';
import { generate } from '../src';
import { serialize } from '../src/language/typescript';
import { fromJSON } from '../src/fileReader';

const self = path.resolve(__dirname);

generate({
	pathsToSpec: [path.resolve(self, './specs/swagger.json'), path.resolve(self, './specs/common.json')],
	out: path.resolve(self, './out'),
	serialize,
	fileReader: fromJSON,
}).catch(error => {
	console.error(error);
	process.exit(1);
});
