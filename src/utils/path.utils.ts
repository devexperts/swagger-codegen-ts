import * as path from 'path';

export const fileName = (file: string): string => path.basename(file, path.extname(file));
