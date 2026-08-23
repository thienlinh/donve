/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsstatusdraft2Inputs */

const vi_campaignsstatusdraft2 =
  /** @type {(inputs: Campaignsstatusdraft2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nháp`;
  };

const en_campaignsstatusdraft2 =
  /** @type {(inputs: Campaignsstatusdraft2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Draft`;
  };

/**
 * | output |
 * | --- |
 * | "Draft" |
 *
 * @param {Campaignsstatusdraft2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsstatusdraft2 =
  /** @type {((inputs?: Campaignsstatusdraft2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsstatusdraft2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsstatusdraft2(inputs);
      return vi_campaignsstatusdraft2(inputs);
    }
  );
export { campaignsstatusdraft2 as "campaignsStatusDraft" };
