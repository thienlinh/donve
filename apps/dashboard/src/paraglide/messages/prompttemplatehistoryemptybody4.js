/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatehistoryemptybody4Inputs */

const vi_prompttemplatehistoryemptybody4 =
  /** @type {(inputs: Prompttemplatehistoryemptybody4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chạy thử mẫu ở trên để xem kết quả và điểm Lighthouse tại đây.`;
  };

const en_prompttemplatehistoryemptybody4 =
  /** @type {(inputs: Prompttemplatehistoryemptybody4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Run the template above to see its output and Lighthouse score here.`;
  };

/**
 * | output |
 * | --- |
 * | "Run the template above to see its output and Lighthouse score here." |
 *
 * @param {Prompttemplatehistoryemptybody4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatehistoryemptybody4 =
  /** @type {((inputs?: Prompttemplatehistoryemptybody4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatehistoryemptybody4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatehistoryemptybody4(inputs);
      return vi_prompttemplatehistoryemptybody4(inputs);
    }
  );
export { prompttemplatehistoryemptybody4 as "promptTemplateHistoryEmptyBody" };
