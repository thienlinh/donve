/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Resetpasswordnewlabel3Inputs */

const vi_resetpasswordnewlabel3 =
  /** @type {(inputs: Resetpasswordnewlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mật khẩu mới`;
  };

const en_resetpasswordnewlabel3 =
  /** @type {(inputs: Resetpasswordnewlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `New password`;
  };

/**
 * | output |
 * | --- |
 * | "New password" |
 *
 * @param {Resetpasswordnewlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const resetpasswordnewlabel3 =
  /** @type {((inputs?: Resetpasswordnewlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Resetpasswordnewlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_resetpasswordnewlabel3(inputs);
      return vi_resetpasswordnewlabel3(inputs);
    }
  );
export { resetpasswordnewlabel3 as "resetPasswordNewLabel" };
