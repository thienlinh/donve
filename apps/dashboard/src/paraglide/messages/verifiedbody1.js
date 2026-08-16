/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Verifiedbody1Inputs */

const vi_verifiedbody1 =
  /** @type {(inputs: Verifiedbody1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay bây giờ.`;
  };

const en_verifiedbody1 =
  /** @type {(inputs: Verifiedbody1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Your email has been verified. You can log in now.`;
  };

/**
 * | output |
 * | --- |
 * | "Your email has been verified. You can log in now." |
 *
 * @param {Verifiedbody1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const verifiedbody1 =
  /** @type {((inputs?: Verifiedbody1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Verifiedbody1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_verifiedbody1(inputs);
      return vi_verifiedbody1(inputs);
    }
  );
export { verifiedbody1 as "verifiedBody" };
