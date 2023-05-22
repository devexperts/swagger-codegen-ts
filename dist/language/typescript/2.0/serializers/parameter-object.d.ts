import { Ref } from '../../../../utils/ref';
import { ParameterObject } from '../../../../schema/2.0/parameter-object';
import { Either } from 'fp-ts/lib/Either';
import { SerializedParameter } from '../../common/data/serialized-parameter';
export declare const serializeParameterObject: (from: Ref<string>, parameterObject: ParameterObject) => Either<Error, SerializedParameter>;
export declare const isRequired: (parameterObject: ParameterObject) => boolean;
