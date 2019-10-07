import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import * as t from 'io-ts';
import { Mixed, record, RecordC, string, StringC } from 'io-ts';

export const stringOption = optionFromNullable(t.string);
export const booleanOption = optionFromNullable(t.boolean);
export const numberOption = optionFromNullable(t.number);
export const stringArrayOption = optionFromNullable(t.array(t.string));
export const primitiveArrayOption = optionFromNullable(t.array(t.union([t.string, t.boolean, t.number])));

export const dictionary = <C extends Mixed>(codec: C, name?: string): RecordC<StringC, C> =>
	record(string, codec, name);
