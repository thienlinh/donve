/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Loginsubmit1Inputs */

const vi_loginsubmit1 =
  /** @type {(inputs: Loginsubmit1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đăng nhập`;
  };

const en_loginsubmit1 =
  /** @type {(inputs: Loginsubmit1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Log in`;
  };

/**
 * | output |
 * | --- |
 * | "Log in" |
 *
 * @param {Loginsubmit1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const loginsubmit1 =
  /** @type {((inputs?: Loginsubmit1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Loginsubmit1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_loginsubmit1(inputs);
      return vi_loginsubmit1(inputs);
    }
  );
export { loginsubmit1 as "loginSubmit" };
