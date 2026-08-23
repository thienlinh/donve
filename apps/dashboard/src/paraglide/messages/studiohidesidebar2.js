/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiohidesidebar2Inputs */

const vi_studiohidesidebar2 =
  /** @type {(inputs: Studiohidesidebar2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ẩn sidebar`;
  };

const en_studiohidesidebar2 =
  /** @type {(inputs: Studiohidesidebar2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hide sidebar`;
  };

/**
 * | output |
 * | --- |
 * | "Hide sidebar" |
 *
 * @param {Studiohidesidebar2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiohidesidebar2 =
  /** @type {((inputs?: Studiohidesidebar2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiohidesidebar2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiohidesidebar2(inputs);
      return vi_studiohidesidebar2(inputs);
    }
  );
export { studiohidesidebar2 as "studioHideSidebar" };
