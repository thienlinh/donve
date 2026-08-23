/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiohidechat2Inputs */

const vi_studiohidechat2 =
  /** @type {(inputs: Studiohidechat2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ẩn chat`;
  };

const en_studiohidechat2 =
  /** @type {(inputs: Studiohidechat2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hide chat`;
  };

/**
 * | output |
 * | --- |
 * | "Hide chat" |
 *
 * @param {Studiohidechat2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiohidechat2 =
  /** @type {((inputs?: Studiohidechat2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiohidechat2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiohidechat2(inputs);
      return vi_studiohidechat2(inputs);
    }
  );
export { studiohidechat2 as "studioHideChat" };
