import { array } from 'fp-ts/lib/Array';
import { either } from 'fp-ts/lib/Either';
import { sequenceT } from 'fp-ts/lib/Apply';

export const sequenceEither = array.sequence(either);
export const sequenceTEither = sequenceT(either);
