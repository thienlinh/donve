/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Signuploginlink2Inputs */

const vi_signuploginlink2 =
  /** @type {(inputs: Signuploginlink2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đăng nhập`;
  };

const en_signuploginlink2 =
  /** @type {(inputs: Signuploginlink2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Log in`;
  };

/**
 * | output |
 * | --- |
 * | "Log in" |
 *
 * @param {Signuploginlink2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const signuploginlink2 =
  /** @type {((inputs?: Signuploginlink2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Signuploginlink2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_signuploginlink2(inputs);
      return vi_signuploginlink2(inputs);
    }
  );
export { signuploginlink2 as "signupLoginLink" };
