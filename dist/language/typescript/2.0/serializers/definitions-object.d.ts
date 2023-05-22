import { Directory } from '../../../../utils/fs';
import { DefinitionsObject } from '../../../../schema/2.0/definitions-object';
import { either } from 'fp-ts';
import { Ref } from '../../../../utils/ref';
export declare const serializeDefinitions: (from: Ref<string>, definitions: DefinitionsObject) => either.Either<Error, Directory>;
