import { TFileReader } from './index';

export const fromJSON: TFileReader = buffer => JSON.parse(buffer.toString());
