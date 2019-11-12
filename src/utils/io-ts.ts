import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import * as t from 'io-ts';
import {
	boolean,
	brand,
	Branded,
	Context,
	intersection,
	Mixed,
	null as iotsNull,
	number,
	OutputOf,
	record,
	RecordC,
	string,
	StringC,
	Type,
	TypeOf,
	union,
	Validation,
	ValidationError,
} from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, option } from 'fp-ts';
import { Either } from 'fp-ts/lib/Either';
import { setFromArray } from 'io-ts-types/lib/setFromArray';
import { Ord } from 'fp-ts/lib/Ord';

export interface Codec<A> extends Type<A, unknown> {}

export const stringOption = optionFromNullable(t.string);
export const booleanOption = optionFromNullable(t.boolean);
export const numberOption = optionFromNullable(t.number);
export const stringArrayOption = optionFromNullable(t.array(t.string));
export const primitiveArrayOption = optionFromNullable(t.array(t.union([t.string, t.boolean, t.number])));

export const dictionary = <C extends Mixed>(codec: C, name?: string): RecordC<StringC, C> =>
	record(string, codec, name);

export const reportIfFailed = <A>(validation: Validation<A>): Either<Error, A> =>
	pipe(
		validation,
		either.mapLeft(e =>
			pipe(
				array.last(e),
				option.fold(
					() => new Error('Validation failure should contain at least one error'),
					e => new Error(getMessage(e)),
				),
			),
		),
	);

function getMessage(e: ValidationError) {
	return e.message !== undefined
		? e.message
		: createMessage(e.context) + '\n in context: \n' + getContextPath(e.context);
}

function createMessage(context: Context) {
	return (
		'\n Received: \n  ' +
		JSON.stringify(context[context.length - 1].actual) +
		'\n expected: \n  ' +
		context[context.length - 1].type.name +
		'\n in field \n  ' +
		context[context.length - 1].key
	);
}

function getContextPath(context: Context) {
	return context
		.map(function(cEntry, index) {
			const padding = new Array(index * 2 + 2).fill(' ').join('');
			return (
				padding + cEntry.key + (index > 0 ? ': ' : '') + cEntry.type.name.replace(/([,{])/g, '$1 \n' + padding)
			);
		})
		.join(' -> \n');
}

export interface IntegerBrand {
	readonly Integer: unique symbol;
}
export type Integer = Branded<number, IntegerBrand>;
export const integer: Codec<Integer> = brand(
	number,
	(n): n is Integer => n !== -Infinity && n !== Infinity && Math.floor(n) === n,
	'Integer',
);

export interface NonNegativeBrand {
	readonly NonNegative: unique symbol;
}
export type NonNegative = Branded<number, NonNegativeBrand>;
export const nonNegative: Codec<NonNegative> = brand(number, (n): n is NonNegative => n >= 0.0, 'NonNegative');

export interface PositiveBrand {
	readonly Positive: unique symbol;
}
export type Positive = Branded<number, PositiveBrand>;
export const positive: Codec<Positive> = brand(number, (n): n is Positive => n > 0.0, 'Positive');

export type Natural = NonNegative & Integer;
export const natural: Codec<Natural> = intersection([nonNegative, integer], 'Natural');

export interface NonEmptySetBrand {
	readonly NonEmptySet: unique symbol;
}
export type NonEmptySet<A> = Branded<Set<A>, NonEmptySetBrand>;
export const nonEmptySetFromArray = <C extends Mixed>(
	codec: C,
	ord: Ord<TypeOf<C>>,
): Type<NonEmptySet<TypeOf<C>>, OutputOf<C>[]> =>
	brand(setFromArray(codec, ord), (s): s is NonEmptySet<TypeOf<C>> => s.size > 0, 'NonEmptySet');

export type JSONPrimitive = string | number | boolean | null;
export const JSONPrimitiveCodec: Codec<JSONPrimitive> = union([string, number, boolean, iotsNull]);

export const split = (separator: string): Type<string[], string, string> =>
	new Type('Split', (u): u is string[] => string.is(u), u => t.success(u.split(separator)), as => as.join(separator));
