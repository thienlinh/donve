/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifychannelemailoption4Inputs */

const vi_leadsnotifychannelemailoption4 =
  /** @type {(inputs: Leadsnotifychannelemailoption4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email (chủ org)`;
  };

const en_leadsnotifychannelemailoption4 =
  /** @type {(inputs: Leadsnotifychannelemailoption4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email (org owner)`;
  };

/**
 * | output |
 * | --- |
 * | "Email (org owner)" |
 *
 * @param {Leadsnotifychannelemailoption4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifychannelemailoption4 =
  /** @type {((inputs?: Leadsnotifychannelemailoption4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifychannelemailoption4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifychannelemailoption4(inputs);
      return vi_leadsnotifychannelemailoption4(inputs);
    }
  );
export { leadsnotifychannelemailoption4 as "leadsNotifyChannelEmailOption" };
