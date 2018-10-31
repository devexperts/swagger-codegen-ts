#!/usr/bin/env node

import * as path from 'path';
import { generate } from '../src';
import { serialize } from '../src/language/typescript';

const self = path.resolve(__dirname);

generate({
	pathToSpec: path.resolve(self, './swagger.json'),
	out: path.resolve(self, './out/spec'),
	serialize,
}).catch(error => {
	process.exit(1);
});
