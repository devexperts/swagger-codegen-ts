import { Either } from 'fp-ts/lib/Either';
import { Document } from '../../../../schema/sketch-121/document';
import { option } from 'fp-ts';
import { FSEntity } from '../../../../utils/fs';
export declare const serializeDocument: import("fp-ts/lib/Reader").Reader<import("../utils").Context, (document: Document) => Either<Error, option.Option<FSEntity>>>;
