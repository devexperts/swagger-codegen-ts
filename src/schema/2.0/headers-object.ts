import { Dictionary } from '../../utils/types';
import { HeaderObject } from './header-object';
import { dictionary } from '../../utils/io-ts';

export interface HeadersObject extends Dictionary<HeaderObject> {}

export const HeadersObject = dictionary(HeaderObject, 'HeadersObject');
