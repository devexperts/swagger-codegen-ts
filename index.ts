#!/usr/bin/env node

import * as path from 'path';
import * as fs from 'fs-extra';
import { Spec, Schema, Path } from 'swagger-schema-official';
import { tryCatch } from 'fp-ts/lib/Either';
import { fromEither, fromRefinement, fromNullable, option, Option } from 'fp-ts/lib/Option';
import { array } from 'fp-ts/lib/Array';
import { tuple } from 'fp-ts/lib/function';
import * as prettier from 'prettier';
import { sequenceT } from 'fp-ts/lib/Apply';
import {
	SwaggerObject,
	InfoObject,
	SecurityDefinitionsObject,
	SecurityRequirementObject,
	PathsObject,
	stringOption,
	ResponsesDefinitionsObject,
} from './swagger';
import { PathReporter } from 'io-ts/lib/PathReporter';
import {
	PathItemObject,
	OperationObject,
	stringArrayOption,
	ParameterObject,
	ResponseObject,
	SchemaObject,
} from './swagger';
import { map, write } from './fs';
import { serializeSwaggerObject } from './serializer2';

const root = process.cwd();
const destination = path.resolve('./out');
const name = 'spec';
const json = path.resolve(root, './ads-swagger-specs.json');
const prettierConfig = path.resolve(root, '.prettierrc');

// fs.mkdirSync(path.resolve(destination));

async function run() {
	const raw = await fs.readFile(json);
	const spec = JSON.parse(raw.toString());
	const decoded = SwaggerObject.decode(spec);
	const serialized = decoded.map(spec => serializeSwaggerObject(name, spec));
	const config = fromNullable(await prettier.resolveConfig(prettierConfig));
	if (serialized.isRight() && config.isSome()) {
		const formatted = map(serialized.value, serialized => prettier.format(serialized, config.value));
		await fs.remove(destination);
		await fs.mkdirp(destination);
		await write(destination, formatted);
	}
}
run();
