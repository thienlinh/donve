/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsbulkassignerrortoast4Inputs */

const vi_leadsbulkassignerrortoast4 =
  /** @type {(inputs: Leadsbulkassignerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không gán được các lead đã chọn. Thử lại.`;
  };

const en_leadsbulkassignerrortoast4 =
  /** @type {(inputs: Leadsbulkassignerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't assign the selected leads. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't assign the selected leads. Try again." |
 *
 * @param {Leadsbulkassignerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkassignerrortoast4 =
  /** @type {((inputs?: Leadsbulkassignerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkassignerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkassignerrortoast4(inputs);
      return vi_leadsbulkassignerrortoast4(inputs);
    }
  );
export { leadsbulkassignerrortoast4 as "leadsBulkAssignErrorToast" };
