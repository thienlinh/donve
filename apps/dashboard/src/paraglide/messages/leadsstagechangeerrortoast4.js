/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsstagechangeerrortoast4Inputs */

const vi_leadsstagechangeerrortoast4 =
  /** @type {(inputs: Leadsstagechangeerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không đổi được trạng thái lead. Thử lại.`;
  };

const en_leadsstagechangeerrortoast4 =
  /** @type {(inputs: Leadsstagechangeerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't move this lead. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't move this lead. Try again." |
 *
 * @param {Leadsstagechangeerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsstagechangeerrortoast4 =
  /** @type {((inputs?: Leadsstagechangeerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsstagechangeerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsstagechangeerrortoast4(inputs);
      return vi_leadsstagechangeerrortoast4(inputs);
    }
  );
export { leadsstagechangeerrortoast4 as "leadsStageChangeErrorToast" };
