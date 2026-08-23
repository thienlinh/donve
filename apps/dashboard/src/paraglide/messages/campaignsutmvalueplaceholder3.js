/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsutmvalueplaceholder3Inputs */

const vi_campaignsutmvalueplaceholder3 =
  /** @type {(inputs: Campaignsutmvalueplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Giá trị`;
  };

const en_campaignsutmvalueplaceholder3 =
  /** @type {(inputs: Campaignsutmvalueplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Value`;
  };

/**
 * | output |
 * | --- |
 * | "Value" |
 *
 * @param {Campaignsutmvalueplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsutmvalueplaceholder3 =
  /** @type {((inputs?: Campaignsutmvalueplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsutmvalueplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsutmvalueplaceholder3(inputs);
      return vi_campaignsutmvalueplaceholder3(inputs);
    }
  );
export { campaignsutmvalueplaceholder3 as "campaignsUtmValuePlaceholder" };
