#!/usr/bin/env node

import * as path from 'path';
import * as fs from 'fs-extra';
import { fromNullable } from 'fp-ts/lib/Option';
import * as prettier from 'prettier';

import { SwaggerObject } from '../src/swagger';
import { map, write } from '../src/fs';
import { serializeSwaggerObject } from '../src/serializer';

const dirname = path.resolve(__dirname);
const root = path.resolve(dirname, '..');
const destination = path.resolve('./out');
const name = 'spec';
const json = path.resolve(root, './specs/swagger.json');

const prettierConfig = path.resolve(root, '.prettierrc');

async function run() {
	const raw = await fs.readFile(json);
	const spec = JSON.parse(raw.toString());
	const decoded = SwaggerObject.decode(spec);
	const serialized = decoded.map(spec => serializeSwaggerObject(name, spec));
	const config = fromNullable(await prettier.resolveConfig(prettierConfig));
	await fs.remove(destination);
	if (serialized.isRight() && config.isSome()) {
		const formatted = map(serialized.value, serialized => prettier.format(serialized, config.value));
		await fs.mkdirp(destination);
		await write(destination, formatted);
	}
}
run();
