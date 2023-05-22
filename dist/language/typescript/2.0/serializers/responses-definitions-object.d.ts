import { Ref } from '../../../../utils/ref';
import { ResponsesDefinitionsObject } from '../../../../schema/2.0/responses-definitions-object';
import { Either } from 'fp-ts/lib/Either';
import { FSEntity } from '../../../../utils/fs';
export declare const serializeResponsesDefinitionsObject: (from: Ref<string>, responsesDefinitionsObject: ResponsesDefinitionsObject) => Either<Error, FSEntity>;
