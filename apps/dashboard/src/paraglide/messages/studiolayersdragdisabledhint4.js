/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ threshold: NonNullable<unknown> }} Studiolayersdragdisabledhint4Inputs */

const vi_studiolayersdragdisabledhint4 =
  /** @type {(inputs: Studiolayersdragdisabledhint4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Kéo thả tạm tắt khi trang có hơn ${i?.threshold} layer — dùng biểu tượng mắt để ẩn thay thế.`;
  };

const en_studiolayersdragdisabledhint4 =
  /** @type {(inputs: Studiolayersdragdisabledhint4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Drag-to-reorder is off above ${i?.threshold} layers on this page — use the eye icon to hide instead.`;
  };

/**
 * | output |
 * | --- |
 * | "Drag-to-reorder is off above {threshold} layers on this page — use the eye icon to hide instead." |
 *
 * @param {Studiolayersdragdisabledhint4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiolayersdragdisabledhint4 =
  /** @type {((inputs: Studiolayersdragdisabledhint4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiolayersdragdisabledhint4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiolayersdragdisabledhint4(inputs);
      return vi_studiolayersdragdisabledhint4(inputs);
    }
  );
export { studiolayersdragdisabledhint4 as "studioLayersDragDisabledHint" };
