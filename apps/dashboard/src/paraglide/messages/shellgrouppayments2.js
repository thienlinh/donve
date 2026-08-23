/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellgrouppayments2Inputs */

const vi_shellgrouppayments2 =
  /** @type {(inputs: Shellgrouppayments2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thanh toán`;
  };

const en_shellgrouppayments2 =
  /** @type {(inputs: Shellgrouppayments2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Payments`;
  };

/**
 * | output |
 * | --- |
 * | "Payments" |
 *
 * @param {Shellgrouppayments2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellgrouppayments2 =
  /** @type {((inputs?: Shellgrouppayments2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellgrouppayments2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellgrouppayments2(inputs);
      return vi_shellgrouppayments2(inputs);
    }
  );
export { shellgrouppayments2 as "shellGroupPayments" };
