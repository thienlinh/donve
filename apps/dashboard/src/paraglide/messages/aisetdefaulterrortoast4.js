/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aisetdefaulterrortoast4Inputs */

const vi_aisetdefaulterrortoast4 =
  /** @type {(inputs: Aisetdefaulterrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không đặt được kết nối mặc định. Vui lòng thử lại.`;
  };

const en_aisetdefaulterrortoast4 =
  /** @type {(inputs: Aisetdefaulterrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't set this connection as default. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't set this connection as default. Try again." |
 *
 * @param {Aisetdefaulterrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aisetdefaulterrortoast4 =
  /** @type {((inputs?: Aisetdefaulterrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aisetdefaulterrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aisetdefaulterrortoast4(inputs);
      return vi_aisetdefaulterrortoast4(inputs);
    }
  );
export { aisetdefaulterrortoast4 as "aiSetDefaultErrorToast" };
