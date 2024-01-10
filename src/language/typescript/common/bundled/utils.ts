import { fromString } from '../../../../utils/ref';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { fromRef } from '../../../../utils/fs';
import * as fs from 'fs';
import * as path from 'path';

export const utilsRef = fromString('#/utils/utils');

const utilsSourceCode = fs.readFileSync(path.resolve(__dirname, 'utils.bundle.ts'), 'utf8');

export const utilsFile = pipe(
	utilsRef,
	either.map(ref => fromRef(ref, '.ts', utilsSourceCode)),
);
