"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./color");
const fp_ts_1 = require("fp-ts");
const pipeable_1 = require("fp-ts/lib/pipeable");
const utils_1 = require("../../../common/utils");
const gradient_1 = require("./gradient");
const either_1 = require("../../../../../utils/either");
const option_1 = require("../../../../../utils/option");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const utils_2 = require("../../utils");
exports.serializeAssetCollection = reader_utils_1.combineReader(utils_2.context, context => (assets) => {
    const colorAssets = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(assets.colorAssets), fp_ts_1.option.map(fp_ts_1.nonEmptyArray.map(colorAsset => {
        const safeName = context.nameStorage.getSafeName(colorAsset.do_objectID, colorAsset.name);
        const color = color_1.serializeColor(colorAsset.color);
        return `
					${utils_1.getJSDoc([colorAsset.name, colorAsset.do_objectID])}
					const ${safeName} = '${color}';
				`;
    })), fp_ts_1.option.map(lines => lines.join('\n')));
    const gradientAssets = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(assets.gradientAssets), fp_ts_1.option.map(gradientAssets => either_1.traverseNEAEither(gradientAssets, gradientAsset => {
        const safeName = context.nameStorage.getSafeName(gradientAsset.do_objectID, gradientAsset.name);
        return pipeable_1.pipe(gradient_1.serializeGradient(gradientAsset.gradient), fp_ts_1.either.map(gradient => `
							${utils_1.getJSDoc([gradientAsset.name, gradientAsset.do_objectID])}
							const ${safeName} = '${gradient}';
						`));
    })), option_1.sequenceOptionEither, fp_ts_1.either.map(fp_ts_1.option.map(lines => lines.join('\n'))));
    const colors = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(assets.colors), fp_ts_1.option.map(colors => `
				${utils_1.getJSDoc(['Colors'])}
				const colors = [
					${colors.map(color => `'${color_1.serializeColor(color)}'`).join(', ')}
				];
			`));
    const gradients = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(assets.gradients), fp_ts_1.option.map(gradients => either_1.traverseNEAEither(gradients, gradient_1.serializeGradient)), option_1.sequenceOptionEither, fp_ts_1.either.map(fp_ts_1.option.map(gradients => `
					${utils_1.getJSDoc(['Gradients'])}
					const gradients = [
						${gradients.map(gradient => `'${gradient}'`).join(', ')}
					];
				`)));
    return either_utils_1.combineEither(gradients, gradientAssets, (gradients, gradientAssets) => pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(fp_ts_1.array.compact([colorAssets, gradientAssets, colors, gradients])), fp_ts_1.option.map(parts => `
					${utils_1.getJSDoc(['Assets', assets.do_objectID])}
					
					${parts.join('\n')}
				`)));
});
