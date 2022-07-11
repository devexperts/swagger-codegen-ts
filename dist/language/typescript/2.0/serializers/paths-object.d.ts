import { PathsObject } from '../../../../schema/2.0/paths-object';
import { Directory } from '../../../../utils/fs';
import { either } from 'fp-ts';
import { Ref } from '../../../../utils/ref';
export declare const serializePaths: import("fp-ts/lib/Reader").Reader<import("../../../../utils/ref").ResolveRefContext, (from: Ref<string>, paths: PathsObject) => either.Either<Error, Directory>>;
