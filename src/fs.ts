import * as fs from 'fs-extra';
import * as path from 'path';

export type TFile = {
	type: 'FILE';
	name: string;
	content: string;
};

export const file = (name: string, content: string): TFile => ({
	type: 'FILE',
	name,
	content,
});

export type TDirectory = {
	type: 'DIRECTORY';
	name: string;
	content: TFSEntity[];
};

export const directory = (name: string, content: TFSEntity[]): TDirectory => ({
	type: 'DIRECTORY',
	name,
	content,
});

export type TFSEntity = TFile | TDirectory;

export type TBuffer = {
	buffer: Buffer;
	fileName: string;
};

export const write = async (destination: string, entity: TFSEntity): Promise<void> => {
	switch (entity.type) {
		case 'FILE': {
			const filePath = path.resolve(destination, entity.name);
			await fs.writeFile(filePath, entity.content);
			break;
		}
		case 'DIRECTORY': {
			const directoryPath = path.resolve(destination, entity.name);
			await fs.mkdirp(directoryPath);
			for (const contentEntity of entity.content) {
				await write(directoryPath, contentEntity);
			}
			break;
		}
	}
};

export const map = (entity: TFSEntity, f: (content: string) => string): TFSEntity => {
	switch (entity.type) {
		case 'FILE': {
			return file(entity.name, f(entity.content));
		}
		case 'DIRECTORY': {
			return directory(entity.name, entity.content.map(entity => map(entity, f)));
		}
	}
};

export const read = async (_pathToFile: string, cwd: string): Promise<TBuffer> => {
	const pathToFile = path.isAbsolute(_pathToFile) ? _pathToFile : path.resolve(cwd, _pathToFile);
	return {
		buffer: await fs.readFile(pathToFile),
		fileName: path.basename(pathToFile),
	};
};
