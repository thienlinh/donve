/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsordererrortoast3Inputs */

const vi_leadsordererrortoast3 =
  /** @type {(inputs: Leadsordererrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không cập nhật được đơn hàng. Thử lại.`;
  };

const en_leadsordererrortoast3 =
  /** @type {(inputs: Leadsordererrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't update this order. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't update this order. Try again." |
 *
 * @param {Leadsordererrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsordererrortoast3 =
  /** @type {((inputs?: Leadsordererrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsordererrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsordererrortoast3(inputs);
      return vi_leadsordererrortoast3(inputs);
    }
  );
export { leadsordererrortoast3 as "leadsOrderErrorToast" };
