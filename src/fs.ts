import * as fs from 'fs-extra';
import * as path from 'path';
import { fromCompare, Ord } from 'fp-ts/lib/Ord';
import { sort } from 'fp-ts/lib/Array';

export interface File {
	readonly type: 'FILE';
	readonly name: string;
	readonly content: string;
}

export const file = (name: string, content: string): File => ({
	type: 'FILE',
	name,
	content,
});

export interface Directory {
	readonly type: 'DIRECTORY';
	readonly name: string;
	readonly content: FSEntity[];
}

export const directory = (name: string, content: FSEntity[]): Directory => ({
	type: 'DIRECTORY',
	name,
	content,
});

export type FSEntity = File | Directory;

export interface BufferWithName {
	readonly buffer: Buffer;
	readonly fileName: string;
}

export const write = async (destination: string, entity: FSEntity): Promise<void> => {
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

export const map = (entity: FSEntity, f: (content: string) => string): FSEntity => {
	switch (entity.type) {
		case 'FILE': {
			return file(entity.name, f(entity.content));
		}
		case 'DIRECTORY': {
			return directory(entity.name, entity.content.map(entity => map(entity, f)));
		}
	}
};

export const read = async (_pathToFile: string, cwd: string): Promise<BufferWithName> => {
	const pathToFile = path.isAbsolute(_pathToFile) ? _pathToFile : path.resolve(cwd, _pathToFile);
	return {
		buffer: await fs.readFile(pathToFile),
		fileName: path.basename(pathToFile),
	};
};

const ordFSEntity: Ord<FSEntity> = fromCompare((x, y) => {
	switch (x.type) {
		case 'DIRECTORY': {
			switch (y.type) {
				case 'DIRECTORY': {
					return 0;
				}
				case 'FILE': {
					return 1;
				}
			}
			break;
		}
		case 'FILE': {
			switch (y.type) {
				case 'DIRECTORY': {
					return -1;
				}
				case 'FILE': {
					return 0;
				}
			}
			break;
		}
	}
	return 0;
});
const sortFSEntities = sort(ordFSEntity);

export const show = (fs: FSEntity, indent = ''): string => {
	switch (fs.type) {
		case 'FILE': {
			return `${indent}${fs.name}`;
		}
		case 'DIRECTORY': {
			const children = sortFSEntities(fs.content)
				.map(e => show(e, indent + '  '))
				.join('\n');
			return `${indent}${fs.name}/\n${children}`;
		}
	}
};
