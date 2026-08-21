/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioshowsidebar2Inputs */

const vi_studioshowsidebar2 =
  /** @type {(inputs: Studioshowsidebar2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hiện sidebar`;
  };

const en_studioshowsidebar2 =
  /** @type {(inputs: Studioshowsidebar2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Show sidebar`;
  };

/**
 * | output |
 * | --- |
 * | "Show sidebar" |
 *
 * @param {Studioshowsidebar2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioshowsidebar2 =
  /** @type {((inputs?: Studioshowsidebar2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioshowsidebar2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioshowsidebar2(inputs);
      return vi_studioshowsidebar2(inputs);
    }
  );
export { studioshowsidebar2 as "studioShowSidebar" };
