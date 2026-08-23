/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Resetpasswordsubmit2Inputs */

const vi_resetpasswordsubmit2 =
  /** @type {(inputs: Resetpasswordsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đặt lại mật khẩu`;
  };

const en_resetpasswordsubmit2 =
  /** @type {(inputs: Resetpasswordsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Reset password`;
  };

/**
 * | output |
 * | --- |
 * | "Reset password" |
 *
 * @param {Resetpasswordsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const resetpasswordsubmit2 =
  /** @type {((inputs?: Resetpasswordsubmit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Resetpasswordsubmit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_resetpasswordsubmit2(inputs);
      return vi_resetpasswordsubmit2(inputs);
    }
  );
export { resetpasswordsubmit2 as "resetPasswordSubmit" };
