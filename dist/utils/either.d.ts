import { either, nonEmptyArray, option } from 'fp-ts';
export declare const traverseArrayEither: <A, E, B>(ta: A[], f: (a: A) => either.Either<E, B>) => either.Either<E, B[]>;
export declare const traverseNEAEither: <A, E, B>(ta: nonEmptyArray.NonEmptyArray<A>, f: (a: A) => either.Either<E, B>) => either.Either<E, nonEmptyArray.NonEmptyArray<B>>;
export declare const traverseOptionEither: <A, E, B>(ta: option.Option<A>, f: (a: A) => either.Either<E, B>) => either.Either<E, option.Option<B>>;
