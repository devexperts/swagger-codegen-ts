import { getMonoid as getArrayMonoid } from 'fp-ts/lib/Array';

export const monoidStrings = getArrayMonoid<string>();
