import { HTTPMethod } from '../../common/utils';
import { SerializedType } from '../../common/data/serialized-type';
import { either } from 'fp-ts';
import { SerializedPathParameter } from '../../common/data/serialized-path-parameter';
import { ResolveRefContext, Ref } from '../../../../utils/ref';
import { OperationObject } from '../../../../schema/3.0/operation-object';
import { ParameterObject } from '../../../../schema/3.0/parameter-object';
import { Option } from 'fp-ts/lib/Option';
import { Kind } from '../../../../utils/types';
import { PathItemObject } from '../../../../schema/3.0/path-item-object';
import { SerializedFragment } from '../../common/data/serialized-fragment';
export declare const getOperationName: (pattern: string, operation: OperationObject, method: HTTPMethod) => string;
interface Parameters {
    readonly pathParameters: ParameterObject[];
    readonly serializedPathParameters: SerializedPathParameter[];
    readonly serializedQueryParameter: Option<SerializedType>;
    readonly serializedBodyParameter: Option<SerializedType>;
    readonly serializedHeadersParameter: Option<SerializedType>;
    readonly serializedQueryString: Option<SerializedFragment>;
}
export declare const getParameters: import("fp-ts/lib/Reader").Reader<ResolveRefContext & import("./schema-object").SerializeSchemaObjectWithRecursionContext, (from: Ref<string>, operation: OperationObject, pathItem: PathItemObject) => either.Either<Error, Parameters>>;
export declare const serializeOperationObject: import("fp-ts/lib/Reader").Reader<ResolveRefContext & import("./schema-object").SerializeSchemaObjectWithRecursionContext, (pattern: string, method: HTTPMethod, from: Ref<string>, kind: Kind, operation: OperationObject, pathItem: PathItemObject) => either.Either<Error, SerializedType>>;
export {};
