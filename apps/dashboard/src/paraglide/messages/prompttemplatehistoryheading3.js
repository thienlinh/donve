/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatehistoryheading3Inputs */

const vi_prompttemplatehistoryheading3 =
  /** @type {(inputs: Prompttemplatehistoryheading3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lịch sử chạy thử`;
  };

const en_prompttemplatehistoryheading3 =
  /** @type {(inputs: Prompttemplatehistoryheading3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Past runs`;
  };

/**
 * | output |
 * | --- |
 * | "Past runs" |
 *
 * @param {Prompttemplatehistoryheading3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatehistoryheading3 =
  /** @type {((inputs?: Prompttemplatehistoryheading3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatehistoryheading3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatehistoryheading3(inputs);
      return vi_prompttemplatehistoryheading3(inputs);
    }
  );
export { prompttemplatehistoryheading3 as "promptTemplateHistoryHeading" };
