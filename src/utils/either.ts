import { either, array, nonEmptyArray } from 'fp-ts';

export const traverseArrayEither = array.array.traverse(either.either);
export const traverseNEAEither = nonEmptyArray.nonEmptyArray.traverse(either.either);
