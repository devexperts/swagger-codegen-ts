import { array } from 'fp-ts/lib/Array';
import { either } from 'fp-ts';

export const traverseArrayEither = array.traverse(either.either);
