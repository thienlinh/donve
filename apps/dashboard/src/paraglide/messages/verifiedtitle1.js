/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Verifiedtitle1Inputs */

const vi_verifiedtitle1 =
  /** @type {(inputs: Verifiedtitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xác thực thành công`;
  };

const en_verifiedtitle1 =
  /** @type {(inputs: Verifiedtitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email verified`;
  };

/**
 * | output |
 * | --- |
 * | "Email verified" |
 *
 * @param {Verifiedtitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const verifiedtitle1 =
  /** @type {((inputs?: Verifiedtitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Verifiedtitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_verifiedtitle1(inputs);
      return vi_verifiedtitle1(inputs);
    }
  );
export { verifiedtitle1 as "verifiedTitle" };
