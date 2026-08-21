/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiorenameerrortoast3Inputs */

const vi_studiorenameerrortoast3 =
  /** @type {(inputs: Studiorenameerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không đổi được tên trang. Vui lòng thử lại.`;
  };

const en_studiorenameerrortoast3 =
  /** @type {(inputs: Studiorenameerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't rename the page. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't rename the page. Try again." |
 *
 * @param {Studiorenameerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiorenameerrortoast3 =
  /** @type {((inputs?: Studiorenameerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiorenameerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiorenameerrortoast3(inputs);
      return vi_studiorenameerrortoast3(inputs);
    }
  );
export { studiorenameerrortoast3 as "studioRenameErrorToast" };
