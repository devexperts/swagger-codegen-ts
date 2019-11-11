import { fromString } from '../../../../utils/ref';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { fromRef } from '../../../../utils/fs';

export const utilsRef = fromString('#/utils/utils');

const utils = `
	import { brand, Branded, intersection, number, Type } from 'io-ts';
	
	export interface IntegerBrand {
		readonly Integer: unique symbol;
	}
	export type Integer = Branded<number, IntegerBrand>;
	export const integer: Type<Integer, number> = brand(
		number,
		(n): n is Integer => n !== -Infinity && n !== Infinity && Math.floor(n) === n,
		'Integer',
	);
	
	export interface NonNegativeBrand {
		readonly NonNegative: unique symbol;
	}
	export type NonNegative = Branded<number, NonNegativeBrand>;
	export const nonNegative: Type<NonNegative, number> = brand(number, (n): n is NonNegative => n >= 0.0, 'NonNegative');
	
	export interface PositiveBrand {
		readonly Positive: unique symbol;
	}
	export type Positive = Branded<number, PositiveBrand>;
	export const positive: Type<Positive, number> = brand(number, (n): n is Positive => n > 0.0, 'Positive');
	
	export type Natural = NonNegative & Integer;
	export const natural: Type<Natural, number> = intersection([nonNegative, integer], 'Natural');
`;

export const utilsFile = pipe(
	utilsRef,
	either.map(ref => fromRef(ref, '.ts', utils)),
);
