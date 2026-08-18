/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioshare1Inputs */

const vi_studioshare1 =
  /** @type {(inputs: Studioshare1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chia sẻ`;
  };

const en_studioshare1 =
  /** @type {(inputs: Studioshare1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Share`;
  };

/**
 * | output |
 * | --- |
 * | "Share" |
 *
 * @param {Studioshare1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioshare1 =
  /** @type {((inputs?: Studioshare1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioshare1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioshare1(inputs);
      return vi_studioshare1(inputs);
    }
  );
export { studioshare1 as "studioShare" };
