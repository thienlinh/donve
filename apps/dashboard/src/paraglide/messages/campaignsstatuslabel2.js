/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsstatuslabel2Inputs */

const vi_campaignsstatuslabel2 =
  /** @type {(inputs: Campaignsstatuslabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trạng thái`;
  };

const en_campaignsstatuslabel2 =
  /** @type {(inputs: Campaignsstatuslabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Status`;
  };

/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Campaignsstatuslabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsstatuslabel2 =
  /** @type {((inputs?: Campaignsstatuslabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsstatuslabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsstatuslabel2(inputs);
      return vi_campaignsstatuslabel2(inputs);
    }
  );
export { campaignsstatuslabel2 as "campaignsStatusLabel" };
