import { Decoder, literal, type, union } from 'io-ts';
import { FSEntity, write } from './utils/fs';
import * as path from 'path';
import * as $RefParser from 'json-schema-ref-parser';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, taskEither } from 'fp-ts';
import { Either, isLeft } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
import { reportIfFailed } from './utils/io-ts';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { FileFormatCodec } from './schema/sketch-121/file-format';
import { sketchParser } from './parsers/sketch';

export interface GenerateOptions<A> {
	readonly out: string;
	readonly spec: string;
	readonly decoder: Decoder<unknown, A>;
	readonly language: (
		out: string,
		documents: Record<string, A>,
		resolveRef: (ref: string) => Either<unknown, unknown>,
	) => Either<unknown, FSEntity>;
}

const log = (...args: unknown[]) => console.log('[SWAGGER-CODEGEN-TS]:', ...args);
const getUnsafe: <E, A>(e: Either<E, A>) => A = either.fold(e => {
	throw e;
}, identity);

export const generate = <A>(options: GenerateOptions<A>): TaskEither<unknown, void> =>
	taskEither.tryCatch(async () => {
		const cwd = process.cwd();
		const out = path.isAbsolute(options.out) ? options.out : path.resolve(cwd, options.out);
		const spec = path.isAbsolute(options.spec) ? options.spec : path.resolve(cwd, options.spec);
		log('Processing', spec);

		const $refs = await $RefParser.resolve(spec, {
			dereference: {
				circular: 'ignore',
			},
			parse: {
				sketch: sketchParser,
			},
		});

		const specs: Record<string, A> = pipe(
			Object.entries($refs.values()),
			array.reduce({}, (acc, [fullPath, schema]) => {
				const isRoot = fullPath === spec;
				const relative = path.relative(cwd, fullPath);
				// skip specLike check for root because it should always be decoded with passed decoder and fail
				if (!isRoot && isLeft(specLikeCodec.decode(schema))) {
					log('Unable to decode', relative, 'as spec. Treat it as an arbitrary json.');
					// this is not a spec - treat as arbitrary json
					return acc;
				}
				// use getUnsafe to fail fast if unable to decode a spec
				const decoded = getUnsafe(reportIfFailed(options.decoder.decode(schema)));
				log('Decoded', relative);
				return {
					...acc,
					[relative]: decoded,
				};
			}),
		);

		log('Writing to', out);

		await write(
			out,
			getUnsafe(options.language(out, specs, ref => either.tryCatch(() => $refs.get(ref), identity))),
		);

		log('Done');
	}, identity);

const specLikeCodec = union([
	type({
		swagger: literal('2.0'),
	}),
	type({
		openapi: union([literal('3.0.0'), literal('3.0.1'), literal('3.0.2')]),
	}),
	type({
		asyncapi: literal('2.0.0'),
	}),
	type({
		meta: type({
			version: literal(121),
		}),
	}),
]);
