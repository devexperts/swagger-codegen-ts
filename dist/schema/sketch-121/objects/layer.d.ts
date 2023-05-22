import { Codec } from '../../../utils/io-ts';
import { Style } from './style';
import { ObjectID } from './object-id';
import { Option } from 'fp-ts/lib/Option';
import { OverrideValue } from './override-value';
import { LayerClass } from '../enums/layer-class';
export interface Layer {
    readonly _class: LayerClass;
    readonly do_objectID: ObjectID;
    readonly name: string;
    readonly style: Style;
    readonly layers: Option<Layer[]>;
    readonly isVisible: boolean;
    readonly overrideValues: Option<OverrideValue[]>;
    readonly sharedStyleID: Option<ObjectID>;
    readonly symbolID: Option<ObjectID>;
}
export declare const LayerCodec: Codec<Layer>;
