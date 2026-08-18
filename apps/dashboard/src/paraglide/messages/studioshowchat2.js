/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioshowchat2Inputs */

const vi_studioshowchat2 =
  /** @type {(inputs: Studioshowchat2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hiện chat`;
  };

const en_studioshowchat2 =
  /** @type {(inputs: Studioshowchat2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Show chat`;
  };

/**
 * | output |
 * | --- |
 * | "Show chat" |
 *
 * @param {Studioshowchat2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioshowchat2 =
  /** @type {((inputs?: Studioshowchat2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioshowchat2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioshowchat2(inputs);
      return vi_studioshowchat2(inputs);
    }
  );
export { studioshowchat2 as "studioShowChat" };
