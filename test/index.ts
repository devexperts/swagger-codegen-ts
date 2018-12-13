#!/usr/bin/env node

import * as path from 'path';
import { generate } from '../src';
import { serialize } from '../src/language/typescript';
import { fromJSON, fromYaml } from '../src/fileReader';

const self = path.resolve(__dirname);

generate({
	pathsToSpec: [path.resolve(self, './specs/json/swagger.json'), path.resolve(self, './specs/json/common.json')],
	out: path.resolve(self, './out/json'),
	serialize,
	fileReader: fromJSON,
}).catch(error => {
	console.error(error);
	process.exit(1);
});

generate({
	pathsToSpec: [path.resolve(self, './specs/yaml/swagger.yml'), path.resolve(self, './specs/yaml/common.yml')],
	out: path.resolve(self, './out/yaml'),
	serialize,
	fileReader: fromYaml,
}).catch(error => {
	console.error(error);
	process.exit(1);
});
