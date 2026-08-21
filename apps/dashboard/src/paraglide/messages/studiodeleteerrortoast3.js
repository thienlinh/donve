/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodeleteerrortoast3Inputs */

const vi_studiodeleteerrortoast3 =
  /** @type {(inputs: Studiodeleteerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không xoá được trang. Vui lòng thử lại.`;
  };

const en_studiodeleteerrortoast3 =
  /** @type {(inputs: Studiodeleteerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't delete the page. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't delete the page. Try again." |
 *
 * @param {Studiodeleteerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodeleteerrortoast3 =
  /** @type {((inputs?: Studiodeleteerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodeleteerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodeleteerrortoast3(inputs);
      return vi_studiodeleteerrortoast3(inputs);
    }
  );
export { studiodeleteerrortoast3 as "studioDeleteErrorToast" };
