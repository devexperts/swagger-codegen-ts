import { Parser } from './utils';

export const parseJSON: Parser = buffer => JSON.parse(buffer.toString());
