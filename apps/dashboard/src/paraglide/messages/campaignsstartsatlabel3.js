/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsstartsatlabel3Inputs */

const vi_campaignsstartsatlabel3 =
  /** @type {(inputs: Campaignsstartsatlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bắt đầu`;
  };

const en_campaignsstartsatlabel3 =
  /** @type {(inputs: Campaignsstartsatlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Starts`;
  };

/**
 * | output |
 * | --- |
 * | "Starts" |
 *
 * @param {Campaignsstartsatlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsstartsatlabel3 =
  /** @type {((inputs?: Campaignsstartsatlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsstartsatlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsstartsatlabel3(inputs);
      return vi_campaignsstartsatlabel3(inputs);
    }
  );
export { campaignsstartsatlabel3 as "campaignsStartsAtLabel" };
