import { fromString } from '../../../../utils/ref';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { fromRef } from '../../../../utils/fs';

export const utilsRef = fromString('#/utils/utils');

const utils = `
	import { either } from 'fp-ts/lib/Either';
	import { Type, failure, success, string as tstring } from 'io-ts';

	export const DateFromISODateStringIO = new Type<Date, string, unknown>(
		'DateFromISODateString',
		(u): u is Date => u instanceof Date,
		(u, c) =>
			either.chain(tstring.validate(u, c), dateString => {
				const [year, calendarMonth, day] = dateString.split('-');
				const d = new Date(+year, +calendarMonth - 1, +day);
				return isNaN(d.getTime()) ? failure(u, c) : success(d);
			}),
		a =>
			\`\${a.getFullYear().toString().padStart(4, '0')}-\${(a.getMonth() + 1).toString().padStart(2, '0')}-\${a
				.getDate()
				.toString()
				.padStart(2, '0')}\`,
	);
`;

export const utilsFile = pipe(
	utilsRef,
	either.map(ref => fromRef(ref, '.ts', utils)),
);
