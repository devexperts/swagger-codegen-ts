import { fromString } from '../../../../utils/ref';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { fromRef } from '../../../../utils/fs';

export const utilsRef = fromString('#/utils/utils');

const utils = `
	import { either } from 'fp-ts/lib/Either';
	import { Type, failure, success, string as tstring } from 'io-ts';

	const getISOTimezoneOffsetString = (offsetMinutes: number): string => {
		if (offsetMinutes === 0) {
			return 'Z';
		}

		const absoluteOffsetMinutes = Math.abs(offsetMinutes);
		const offsetHours = absoluteOffsetMinutes / 60;
		const offsetRestMinutes = absoluteOffsetMinutes % 60;

		return \`\${offsetMinutes > 0 ? '-' : '+'}\${offsetHours
			.toString()
			.padStart(2, '0')}:\${offsetRestMinutes.toString().padStart(2, '0')}\`;
	};

	export const DateFromISODateStringIO = new Type<Date, string, unknown>(
		'DateFromISODateString',
		(u): u is Date => u instanceof Date,
		(u, c) =>
			either.chain(tstring.validate(u, c), s => {
				const offset = new Date().getTimezoneOffset();
				const d = new Date(\`\${s}T00:00:00\${getISOTimezoneOffsetString(offset)}\`);
				return isNaN(d.getTime()) ? failure(u, c) : success(d);
			}),
		a =>
			\`\${a.getFullYear()}-\${(a.getMonth() + 1).toString().padStart(2, '0')}-\${a
				.getDate()
				.toString()
				.padStart(2, '0')}\`,
	);
`;

export const utilsFile = pipe(
	utilsRef,
	either.map(ref => fromRef(ref, '.ts', utils)),
);
