/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrreceivedatlabel4Inputs */

const vi_leadsdsrreceivedatlabel4 =
  /** @type {(inputs: Leadsdsrreceivedatlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ngày nhận yêu cầu`;
  };

const en_leadsdsrreceivedatlabel4 =
  /** @type {(inputs: Leadsdsrreceivedatlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Received on`;
  };

/**
 * | output |
 * | --- |
 * | "Received on" |
 *
 * @param {Leadsdsrreceivedatlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrreceivedatlabel4 =
  /** @type {((inputs?: Leadsdsrreceivedatlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrreceivedatlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrreceivedatlabel4(inputs);
      return vi_leadsdsrreceivedatlabel4(inputs);
    }
  );
export { leadsdsrreceivedatlabel4 as "leadsDsrReceivedAtLabel" };
