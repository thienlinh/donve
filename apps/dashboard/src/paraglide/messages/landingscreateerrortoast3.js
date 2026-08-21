/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingscreateerrortoast3Inputs */

const vi_landingscreateerrortoast3 =
  /** @type {(inputs: Landingscreateerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tạo được landing page. Vui lòng thử lại.`;
  };

const en_landingscreateerrortoast3 =
  /** @type {(inputs: Landingscreateerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't create the landing page. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't create the landing page. Try again." |
 *
 * @param {Landingscreateerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingscreateerrortoast3 =
  /** @type {((inputs?: Landingscreateerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingscreateerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingscreateerrortoast3(inputs);
      return vi_landingscreateerrortoast3(inputs);
    }
  );
export { landingscreateerrortoast3 as "landingsCreateErrorToast" };
