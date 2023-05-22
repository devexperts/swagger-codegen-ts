import * as t from 'io-ts';
import { Branded, Type } from 'io-ts';
import { either } from 'fp-ts';
import { Ord } from 'fp-ts/lib/Ord';
export interface Codec<A> extends Type<A, unknown> {
}
export declare const stringOption: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<t.StringC>;
export declare const booleanOption: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<t.BooleanC>;
export declare const numberOption: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<t.NumberC>;
export declare const stringArrayOption: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<t.ArrayC<t.StringC>>;
export declare const primitiveArrayOption: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<t.ArrayC<t.UnionC<[t.StringC, t.BooleanC, t.NumberC]>>>;
export declare const dictionary: <C extends t.Mixed>(codec: C, name?: string | undefined) => t.RecordC<t.StringC, C>;
export declare const reportIfFailed: <A>(validation: either.Either<t.Errors, A>) => either.Either<Error, A>;
export interface IntegerBrand {
    readonly Integer: unique symbol;
}
export declare type Integer = Branded<number, IntegerBrand>;
export declare const integer: Codec<Integer>;
export interface NonNegativeBrand {
    readonly NonNegative: unique symbol;
}
export declare type NonNegative = Branded<number, NonNegativeBrand>;
export declare const nonNegative: Codec<NonNegative>;
export interface PositiveBrand {
    readonly Positive: unique symbol;
}
export declare type Positive = Branded<number, PositiveBrand>;
export declare const positive: Codec<Positive>;
export declare type Natural = NonNegative & Integer;
export declare const natural: Codec<Natural>;
export interface NonEmptySetBrand {
    readonly NonEmptySet: unique symbol;
}
export declare type NonEmptySet<A> = Branded<Set<A>, NonEmptySetBrand>;
export declare const nonEmptySetFromArray: <C extends t.Mixed>(codec: C, ord: Ord<C["_A"]>) => t.Type<t.Branded<Set<C["_A"]>, NonEmptySetBrand>, C["_O"][], unknown>;
export declare type JSONPrimitive = string | number | boolean | null;
export declare const JSONPrimitiveCodec: Codec<JSONPrimitive>;
export interface FractionBrand {
    readonly Fraction: unique symbol;
}
export declare type Fraction = Branded<number, FractionBrand>;
export declare const fraction: t.BrandC<t.NumberC, FractionBrand>;
export declare const fractionFromPercentage: (a: t.Branded<number, PercentageBrand>) => either.Either<Error, t.Branded<number, FractionBrand>>;
export interface PercentageBrand {
    readonly Percentage: unique symbol;
}
export declare type Percentage = Branded<number, PercentageBrand>;
export declare const percentage: t.BrandC<t.NumberC, PercentageBrand>;
export declare const percentageFromFraction: (a: t.Branded<number, FractionBrand>) => either.Either<Error, t.Branded<number, PercentageBrand>>;
export declare const mapper: <A extends string | number | boolean, O extends string | number | boolean>(decoded: A, encoded: O, name?: string) => t.Type<A, O, unknown>;
