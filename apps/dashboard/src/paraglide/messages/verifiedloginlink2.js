/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Verifiedloginlink2Inputs */

const vi_verifiedloginlink2 =
  /** @type {(inputs: Verifiedloginlink2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đến trang đăng nhập`;
  };

const en_verifiedloginlink2 =
  /** @type {(inputs: Verifiedloginlink2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Go to login`;
  };

/**
 * | output |
 * | --- |
 * | "Go to login" |
 *
 * @param {Verifiedloginlink2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const verifiedloginlink2 =
  /** @type {((inputs?: Verifiedloginlink2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Verifiedloginlink2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_verifiedloginlink2(inputs);
      return vi_verifiedloginlink2(inputs);
    }
  );
export { verifiedloginlink2 as "verifiedLoginLink" };
