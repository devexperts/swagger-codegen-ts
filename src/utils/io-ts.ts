import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import * as t from 'io-ts';
import { Context, Mixed, record, RecordC, string, StringC, Validation, ValidationError } from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, option } from 'fp-ts';
import { Either } from 'fp-ts/lib/Either';

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
