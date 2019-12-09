import * as fs from 'fs-extra';
import * as path from 'path';
import { getFullPath, Ref } from './ref';
import { split } from './string';
import { pipe } from 'fp-ts/lib/pipeable';
import { head, reverse, tail } from 'fp-ts/lib/NonEmptyArray';
import { array } from 'fp-ts';

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
	content: flatten(content),
});

export interface Fragment {
	readonly type: 'FRAGMENT';
	readonly content: FSEntity[];
}

export const fragment = (content: FSEntity[]): Fragment => ({
	type: 'FRAGMENT',
	content: flatten(content),
});

export type FSEntity = File | Directory | Fragment;

export const write = async (destination: string, entity: FSEntity): Promise<void> => {
	switch (entity.type) {
		case 'FILE': {
			const normalizedEntityName = normalizeFilePath(entity.name);
			const filePath = path.join(destination, normalizedEntityName);
			await fs.outputFile(filePath, entity.content);
			break;
		}
		case 'DIRECTORY': {
			const directoryPath = path.join(destination, entity.name);
			await fs.mkdirp(directoryPath);
			for (const contentEntity of entity.content) {
				await write(directoryPath, contentEntity);
			}
			break;
		}
		case 'FRAGMENT': {
			for (const contentEntity of entity.content) {
				await write(destination, contentEntity);
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
		case 'FRAGMENT': {
			return fragment(entity.content.map(entity => map(entity, f)));
		}
	}
};

export const fromRef = (ref: Ref, extname: string, content: string): FSEntity => {
	const parts = pipe(
		ref,
		getFullPath,
		split('/'),
		reverse,
	);
	return tail(parts).reduce(
		(acc: FSEntity, part: string): FSEntity => directory(part, [acc]),
		file(`${head(parts)}${extname}`, content),
	);
};

const flatten = (entities: FSEntity[]): FSEntity[] =>
	entities.reduce(
		(acc, entity) => (entity.type === 'FRAGMENT' ? acc.concat(...entity.content) : acc.concat(entity)),
		array.array.zero<FSEntity>(),
	);

const normalizeFilePath = (filePath: string): string =>
	filePath.startsWith(path.sep) ? normalizeFilePath(filePath.slice(1)) : filePath;
