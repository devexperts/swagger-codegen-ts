import { either, array, nonEmptyArray, option } from 'fp-ts';

export const traverseArrayEither = array.array.traverse(either.either);
export const traverseNEAEither = nonEmptyArray.nonEmptyArray.traverse(either.either);
export const traverseOptionEither = option.option.traverse(either.either);
