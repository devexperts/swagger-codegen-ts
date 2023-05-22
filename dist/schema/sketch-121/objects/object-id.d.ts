import { Branded } from 'io-ts';
interface ObjectIDBrand {
    readonly ObjectID: unique symbol;
}
export declare type ObjectID = Branded<string, ObjectIDBrand>;
export declare const ObjectIDCodec: import("io-ts").BrandC<import("io-ts").StringC, ObjectIDBrand>;
export {};
