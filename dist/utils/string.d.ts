import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
export declare const unless: (condition: boolean, a: string) => string;
export declare const when: (condition: boolean, a: string) => string;
export declare const before: (symbol: string) => (path: string) => string;
export declare const trim: (s: string) => string;
export declare const split: (symbol: string) => (s: string) => NonEmptyArray<string>;
