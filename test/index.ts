#!/usr/bin/env node

import { resolve } from 'path';
import { run } from '../src';
import { parseJSON } from '../src/parse';

const self = resolve(__dirname);

run({
	specs: [resolve(self, './specs/json/components.json'), resolve(self, './specs/json/swagger.json')],
	parser: parseJSON,
	out: resolve(self, './out/json'),
});

// generate({
// 	pathsToSpec: [resolve(self, './specs/yaml/swagger.yml'), resolve(self, './specs/yaml/common.yml')],
// 	out: resolve(self, './out/yaml'),
// 	serialize,
// 	fileReader: fromYaml,
// }).catch(error => {
// 	console.error(error);
// 	process.exit(1);
// });
