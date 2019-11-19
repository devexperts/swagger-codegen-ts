import { either, option } from 'fp-ts';

export const sequenceOptionEither = option.option.sequence(either.either);
