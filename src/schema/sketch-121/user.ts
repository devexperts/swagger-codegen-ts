import { Codec } from '../../utils/io-ts';
import { type } from 'io-ts';

export interface User {}

export const UserCodec: Codec<User> = type({}, 'User');
