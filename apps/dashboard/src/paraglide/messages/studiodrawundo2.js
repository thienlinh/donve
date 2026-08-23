/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodrawundo2Inputs */

const vi_studiodrawundo2 =
  /** @type {(inputs: Studiodrawundo2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hoàn tác nét vẽ`;
  };

const en_studiodrawundo2 =
  /** @type {(inputs: Studiodrawundo2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Undo stroke`;
  };

/**
 * | output |
 * | --- |
 * | "Undo stroke" |
 *
 * @param {Studiodrawundo2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodrawundo2 =
  /** @type {((inputs?: Studiodrawundo2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodrawundo2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodrawundo2(inputs);
      return vi_studiodrawundo2(inputs);
    }
  );
export { studiodrawundo2 as "studioDrawUndo" };
