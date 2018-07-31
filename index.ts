#!/usr/bin/env node

import * as path from 'path';
import * as fs from 'fs';
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
import { serializeSwaggerObject } from './serializer';
import {
	PathItemObject,
	OperationObject,
	stringArrayOption,
	ParameterObject,
	ResponseObject,
	SchemaObject,
} from './swagger';

const root = process.cwd();
const out = path.resolve(root, 'out.ts');
const json = path.resolve(root, './ads-swagger-specs.json');
const prettierConfig = path.resolve(root, '.prettierrc');
const rawSpec = fromEither(tryCatch(() => JSON.parse(fs.readFileSync(json).toString())));
const decoded = rawSpec.chain(spec => fromEither(SwaggerObject.decode(spec)));

type Dictionary<A> = { [key: string]: A };

async function run() {
	const formatted = sequenceT(option)(
		decoded.map(serializeSwaggerObject),
		fromNullable(await prettier.resolveConfig(prettierConfig)),
	).map(([serialized, config]) => prettier.format(serialized, config));
	if (formatted.isSome()) {
		// console.log(serialized.value.replace(/\n/g, '\n'));
		console.log(formatted.value);
	}
}
run();
