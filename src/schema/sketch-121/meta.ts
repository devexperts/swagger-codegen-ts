import { Codec } from '../../utils/io-ts';
import { type } from 'io-ts';

export interface Meta {}

export const MetaCodec: Codec<Meta> = type({}, 'Meta');
