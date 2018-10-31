#!/usr/bin/env node

import * as path from 'path';
import { generate } from '../src';
import { serialize } from '../src/language/typescript';

const dirname = path.resolve(__dirname);
const root = path.resolve(dirname, '..');

generate({
	pathToSpec: path.resolve(root, './specs/swagger.json'),
	out: path.resolve('./out/spec'),
	serialize,
}).catch(error => console.error(error));
