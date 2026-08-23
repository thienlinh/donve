/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiomoreactionslabel3Inputs */

const vi_studiomoreactionslabel3 =
  /** @type {(inputs: Studiomoreactionslabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thao tác dự án`;
  };

const en_studiomoreactionslabel3 =
  /** @type {(inputs: Studiomoreactionslabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Project actions`;
  };

/**
 * | output |
 * | --- |
 * | "Project actions" |
 *
 * @param {Studiomoreactionslabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiomoreactionslabel3 =
  /** @type {((inputs?: Studiomoreactionslabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiomoreactionslabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiomoreactionslabel3(inputs);
      return vi_studiomoreactionslabel3(inputs);
    }
  );
export { studiomoreactionslabel3 as "studioMoreActionsLabel" };
