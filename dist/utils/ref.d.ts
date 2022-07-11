import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Either } from 'fp-ts/lib/Either';
import { Eq } from 'fp-ts/lib/Eq';
import { Decoder } from 'io-ts';
import { ord } from 'fp-ts';
export interface Ref<R extends string = string> {
    readonly $ref: string;
    readonly name: string;
    readonly path: string;
    readonly target: string;
}
export declare const ordRefByPath: ord.Ord<Ref<string>>;
export declare const eqRef: Eq<Ref>;
export declare const uniqRefs: (as: Ref<string>[]) => Ref<string>[];
export declare const fromString: <R extends string>($ref: R) => Either<Error, Ref<R>>;
export declare const addPathParts: (...parts: NonEmptyArray<string>) => (ref: Ref<string>) => Either<Error, Ref<string>>;
export declare const getRelativePath: (from: Ref<string>, to: Ref<string>) => string;
export declare const getFullPath: (ref: Ref<string>) => string;
export interface ResolveRef {
    <A>($ref: string, decoder: Decoder<unknown, A>): Either<Error, A>;
}
export interface ResolveRefContext {
    readonly resolveRef: ResolveRef;
}
