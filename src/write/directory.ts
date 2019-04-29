import * as fs from 'fs';

interface WriteDirectory {
	path: string;
}

export const writeDirectory = ({ path }: WriteDirectory) => fs.mkdirSync(path, { recursive: true });
