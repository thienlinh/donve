/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsbulkchangestage3Inputs */

const vi_leadsbulkchangestage3 =
  /** @type {(inputs: Leadsbulkchangestage3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đổi stage`;
  };

const en_leadsbulkchangestage3 =
  /** @type {(inputs: Leadsbulkchangestage3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Change stage`;
  };

/**
 * | output |
 * | --- |
 * | "Change stage" |
 *
 * @param {Leadsbulkchangestage3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkchangestage3 =
  /** @type {((inputs?: Leadsbulkchangestage3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkchangestage3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkchangestage3(inputs);
      return vi_leadsbulkchangestage3(inputs);
    }
  );
export { leadsbulkchangestage3 as "leadsBulkChangeStage" };
