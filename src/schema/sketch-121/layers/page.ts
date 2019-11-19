import { Codec } from '../../../utils/io-ts';
import { type } from 'io-ts';

export interface Page {}

export const PageCodec: Codec<Page> = type({}, 'Page');
