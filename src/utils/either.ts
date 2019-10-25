import { array } from 'fp-ts/lib/Array';
import { either } from 'fp-ts/lib/Either';

export const traverseArrayEither = array.traverse(either);
