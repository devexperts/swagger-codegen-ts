import { Codec } from '../../../utils/io-ts';
import { Style } from './style';
import { ObjectID } from './object-id';
export interface SharedStyle {
    readonly do_objectID: ObjectID;
    readonly name: string;
    readonly value: Style;
}
export declare const SharedStyleCodec: Codec<SharedStyle>;
