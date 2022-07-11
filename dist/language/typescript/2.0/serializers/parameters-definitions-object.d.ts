import { ParametersDefinitionsObject } from '../../../../schema/2.0/parameters-definitions-object';
import { Either } from 'fp-ts/lib/Either';
import { FSEntity } from '../../../../utils/fs';
import { Ref } from '../../../../utils/ref';
export declare const serializeParametersDefinitionsObject: (from: Ref<string>, parametersDefinitionsObject: ParametersDefinitionsObject) => Either<Error, FSEntity>;
