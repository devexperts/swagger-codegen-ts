import { BaseItemsObject } from './base-items-object';
import { Option } from 'fp-ts/lib/Option';
import { ItemsObject } from './items-object';

export interface ArrayItemsObject extends BaseItemsObject {
	readonly type: 'array';
	readonly items: Option<ItemsObject[]>;
}
