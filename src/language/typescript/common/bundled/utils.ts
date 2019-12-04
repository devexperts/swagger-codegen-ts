import { fromString } from '../../../../utils/ref';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { fromRef } from '../../../../utils/fs';

export const utilsRef = fromString('#/utils/utils');

const utils = `
`;

export const utilsFile = pipe(
	utilsRef,
	either.map(ref => fromRef(ref, '.ts', utils)),
);
