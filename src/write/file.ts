import * as fs from 'fs';

interface WriteFileProps {
	content: string;
	extension: string;
	name: string;
	path: string;
}
export const writeFile = ({ content, extension, name, path }: WriteFileProps) => {
	fs.writeFileSync(`${path}/${name}.${extension}`, content);
};
