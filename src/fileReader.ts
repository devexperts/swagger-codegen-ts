import { TFileReader } from './index';
import * as yaml from 'js-yaml';

export const fromJSON: TFileReader = buffer => JSON.parse(buffer.toString());

export const fromYaml: TFileReader = buffer => yaml.safeLoad(buffer.toString());
