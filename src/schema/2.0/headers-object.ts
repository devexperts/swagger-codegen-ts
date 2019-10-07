import { Dictionary } from '../../utils/types';
import { HeaderObject } from './header-object';
import * as t from 'io-ts';

export interface HeadersObject extends Dictionary<HeaderObject> {}

export const HeadersObject = t.record(t.string, HeaderObject, 'HeadersObject');
