/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsbulkdeleteerrortoast4Inputs */

const vi_leadsbulkdeleteerrortoast4 =
  /** @type {(inputs: Leadsbulkdeleteerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không xoá được các lead đã chọn. Thử lại.`;
  };

const en_leadsbulkdeleteerrortoast4 =
  /** @type {(inputs: Leadsbulkdeleteerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't delete the selected leads. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't delete the selected leads. Try again." |
 *
 * @param {Leadsbulkdeleteerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkdeleteerrortoast4 =
  /** @type {((inputs?: Leadsbulkdeleteerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkdeleteerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkdeleteerrortoast4(inputs);
      return vi_leadsbulkdeleteerrortoast4(inputs);
    }
  );
export { leadsbulkdeleteerrortoast4 as "leadsBulkDeleteErrorToast" };
