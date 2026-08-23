/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocomingsoon2Inputs */

const vi_studiocomingsoon2 =
  /** @type {(inputs: Studiocomingsoon2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sắp ra mắt`;
  };

const en_studiocomingsoon2 =
  /** @type {(inputs: Studiocomingsoon2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Coming soon`;
  };

/**
 * | output |
 * | --- |
 * | "Coming soon" |
 *
 * @param {Studiocomingsoon2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocomingsoon2 =
  /** @type {((inputs?: Studiocomingsoon2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocomingsoon2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocomingsoon2(inputs);
      return vi_studiocomingsoon2(inputs);
    }
  );
export { studiocomingsoon2 as "studioComingSoon" };
