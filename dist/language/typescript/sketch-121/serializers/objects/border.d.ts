import { Border } from '../../../../../schema/sketch-121/objects/border';
import { Either } from 'fp-ts/lib/Either';
import { BorderOptions } from '../../../../../schema/sketch-121/objects/border-options';
export declare const serializeBorder: (border: Border, borderOptions: BorderOptions) => Either<Error, string>;
