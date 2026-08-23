/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatehistoryemptytitle4Inputs */

const vi_prompttemplatehistoryemptytitle4 =
  /** @type {(inputs: Prompttemplatehistoryemptytitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có lần chạy thử nào`;
  };

const en_prompttemplatehistoryemptytitle4 =
  /** @type {(inputs: Prompttemplatehistoryemptytitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No test runs yet`;
  };

/**
 * | output |
 * | --- |
 * | "No test runs yet" |
 *
 * @param {Prompttemplatehistoryemptytitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatehistoryemptytitle4 =
  /** @type {((inputs?: Prompttemplatehistoryemptytitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatehistoryemptytitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatehistoryemptytitle4(inputs);
      return vi_prompttemplatehistoryemptytitle4(inputs);
    }
  );
export { prompttemplatehistoryemptytitle4 as "promptTemplateHistoryEmptyTitle" };
