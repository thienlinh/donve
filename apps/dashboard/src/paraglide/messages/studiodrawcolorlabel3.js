/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodrawcolorlabel3Inputs */

const vi_studiodrawcolorlabel3 =
  /** @type {(inputs: Studiodrawcolorlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Màu`;
  };

const en_studiodrawcolorlabel3 =
  /** @type {(inputs: Studiodrawcolorlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Color`;
  };

/**
 * | output |
 * | --- |
 * | "Color" |
 *
 * @param {Studiodrawcolorlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodrawcolorlabel3 =
  /** @type {((inputs?: Studiodrawcolorlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodrawcolorlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodrawcolorlabel3(inputs);
      return vi_studiodrawcolorlabel3(inputs);
    }
  );
export { studiodrawcolorlabel3 as "studioDrawColorLabel" };
