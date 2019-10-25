import { Decoder } from 'io-ts';
import { FSEntity, write } from './utils/fs';
import * as path from 'path';
import * as $RefParser from 'json-schema-ref-parser';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, taskEither } from 'fp-ts';
import { Either } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
import { reportIfFailed } from './utils/io-ts';
import { TaskEither } from 'fp-ts/lib/TaskEither';

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
		log('cwd', cwd);

		const out = path.isAbsolute(options.out) ? options.out : path.resolve(cwd, options.out);
		log('out', out);

		const spec = path.isAbsolute(options.spec) ? options.spec : path.resolve(cwd, options.spec);
		log('spec', spec);

		const $refs = await $RefParser.resolve(spec, {
			dereference: {
				circular: 'ignore',
			},
		});

		const specs: Record<string, A> = pipe(
			Object.entries($refs.values()),
			array.reduce({}, (acc, [fullPath, spec]) => {
				const relative = path.relative(cwd, fullPath);
				log('Decoding', relative);
				return {
					...acc,
					[relative]: getUnsafe(reportIfFailed(options.decoder.decode(spec))),
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
