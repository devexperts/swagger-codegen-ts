import { resolve } from 'path';
import { fromJSON } from '../src2/fromJSON';

const self = resolve(__dirname);
const pathsToSpec = [resolve(self, './specs/json/common.json'), resolve(self, './specs/json/swagger.json')];

fromJSON(pathsToSpec);
