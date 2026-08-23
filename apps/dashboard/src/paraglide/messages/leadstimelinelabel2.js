/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadstimelinelabel2Inputs */

const vi_leadstimelinelabel2 =
  /** @type {(inputs: Leadstimelinelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dòng thời gian`;
  };

const en_leadstimelinelabel2 =
  /** @type {(inputs: Leadstimelinelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Timeline`;
  };

/**
 * | output |
 * | --- |
 * | "Timeline" |
 *
 * @param {Leadstimelinelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadstimelinelabel2 =
  /** @type {((inputs?: Leadstimelinelabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadstimelinelabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadstimelinelabel2(inputs);
      return vi_leadstimelinelabel2(inputs);
    }
  );
export { leadstimelinelabel2 as "leadsTimelineLabel" };
