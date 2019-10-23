import { Either, fold } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
import { Task } from 'fp-ts/lib/Task';

export const log = (...args: unknown[]) => console.log('[SWAGGER-CODEGEN-TS]:', ...args);
export const getUnsafe: <E, A>(e: Either<E, A>) => A = fold(e => {
	throw e;
}, identity);
export const runUnsafe = (task: Task<unknown>): void => {
	task().catch(e => {
		console.error(e);
		process.exit(1);
	});
};
