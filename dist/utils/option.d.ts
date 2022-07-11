import { either, option } from 'fp-ts';
export declare const sequenceOptionEither: <E, A>(ta: option.Option<either.Either<E, A>>) => either.Either<E, option.Option<A>>;
