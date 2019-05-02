import { Parser } from '../utils';
import * as jsyaml from 'js-yaml';

export const parseYAML: Parser = buffer => jsyaml.safeLoad(buffer.toString());
