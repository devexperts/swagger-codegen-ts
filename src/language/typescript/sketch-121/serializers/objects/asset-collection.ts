import { AssetCollection } from '../../../../../schema/sketch-121/objects/asset-collection';
import { Either } from 'fp-ts/lib/Either';
import { Option } from 'fp-ts/lib/Option';
import { serializeColor } from './color';
import { array, either, nonEmptyArray, option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { getJSDoc } from '../../../common/utils';
import { serializeGradient } from './gradient';
import { traverseNEAEither } from '../../../../../utils/either';
import { sequenceOptionEither } from '../../../../../utils/option';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { context } from '../../utils';

export const serializeAssetCollection = combineReader(context, context => (assets: AssetCollection): Either<
	Error,
	Option<string>
> => {
	const colorAssets = pipe(
		nonEmptyArray.fromArray(assets.colorAssets),
		option.map(
			nonEmptyArray.map(colorAsset => {
				const safeName = context.nameStorage.getSafeName(colorAsset.do_objectID, colorAsset.name);
				const color = serializeColor(colorAsset.color);
				return `
					${getJSDoc([colorAsset.name, colorAsset.do_objectID])}
					const ${safeName} = '${color}';
				`;
			}),
		),
		option.map(lines => lines.join('\n')),
	);

	const gradientAssets = pipe(
		nonEmptyArray.fromArray(assets.gradientAssets),
		option.map(gradientAssets =>
			traverseNEAEither(gradientAssets, gradientAsset => {
				const safeName = context.nameStorage.getSafeName(gradientAsset.do_objectID, gradientAsset.name);
				return pipe(
					serializeGradient(gradientAsset.gradient),
					either.map(
						gradient => `
							${getJSDoc([gradientAsset.name, gradientAsset.do_objectID])}
							const ${safeName} = '${gradient}';
						`,
					),
				);
			}),
		),
		sequenceOptionEither,
		either.map(option.map(lines => lines.join('\n'))),
	);

	const colors = pipe(
		nonEmptyArray.fromArray(assets.colors),
		option.map(
			colors => `
				${getJSDoc(['Colors'])}
				const colors = [
					${colors.map(color => `'${serializeColor(color)}'`).join(', ')}
				];
			`,
		),
	);

	const gradients = pipe(
		nonEmptyArray.fromArray(assets.gradients),
		option.map(gradients => traverseNEAEither(gradients, serializeGradient)),
		sequenceOptionEither,
		either.map(
			option.map(
				gradients => `
					${getJSDoc(['Gradients'])}
					const gradients = [
						${gradients.map(gradient => `'${gradient}'`).join(', ')}
					];
				`,
			),
		),
	);

	return combineEither(gradients, gradientAssets, (gradients, gradientAssets) =>
		pipe(
			nonEmptyArray.fromArray(array.compact([colorAssets, gradientAssets, colors, gradients])),
			option.map(
				parts => `
					${getJSDoc(['Assets', assets.do_objectID])}
					
					${parts.join('\n')}
				`,
			),
		),
	);
});
