/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodrawsenderrortoast4Inputs */

const vi_studiodrawsenderrortoast4 =
  /** @type {(inputs: Studiodrawsenderrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không gửi được bản vẽ. Vui lòng thử lại.`;
  };

const en_studiodrawsenderrortoast4 =
  /** @type {(inputs: Studiodrawsenderrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't send the drawing. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't send the drawing. Try again." |
 *
 * @param {Studiodrawsenderrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodrawsenderrortoast4 =
  /** @type {((inputs?: Studiodrawsenderrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodrawsenderrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodrawsenderrortoast4(inputs);
      return vi_studiodrawsenderrortoast4(inputs);
    }
  );
export { studiodrawsenderrortoast4 as "studioDrawSendErrorToast" };
