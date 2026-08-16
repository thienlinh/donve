/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Loginerror1Inputs */

const vi_loginerror1 =
  /** @type {(inputs: Loginerror1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email hoặc mật khẩu không đúng.`;
  };

const en_loginerror1 =
  /** @type {(inputs: Loginerror1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Incorrect email or password.`;
  };

/**
 * | output |
 * | --- |
 * | "Incorrect email or password." |
 *
 * @param {Loginerror1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const loginerror1 =
  /** @type {((inputs?: Loginerror1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Loginerror1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_loginerror1(inputs);
      return vi_loginerror1(inputs);
    }
  );
export { loginerror1 as "loginError" };
