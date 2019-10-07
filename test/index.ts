#!/usr/bin/env node

import { generate } from '../src';
import { fromJSON, fromYaml } from '../src/fileReader';
import { resolve } from 'path';
import { serialize } from '../src/language/typescript/2.0-rx';

const self = resolve(__dirname);

generate({
	pathsToSpec: [resolve(self, './specs/json/swagger.json'), resolve(self, './specs/json/common.json')],
	out: resolve(self, './out/json'),
	serialize,
	fileReader: fromJSON,
}).catch(error => {
	console.error(error);
	process.exit(1);
});

generate({
	pathsToSpec: [resolve(self, './specs/yaml/swagger.yml'), resolve(self, './specs/yaml/common.yml')],
	out: resolve(self, './out/yaml'),
	serialize,
	fileReader: fromYaml,
}).catch(error => {
	console.error(error);
	process.exit(1);
});
