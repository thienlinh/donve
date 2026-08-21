/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrdialogtitle3Inputs */

const vi_leadsdsrdialogtitle3 =
  /** @type {(inputs: Leadsdsrdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ghi nhận yêu cầu dữ liệu cá nhân`;
  };

const en_leadsdsrdialogtitle3 =
  /** @type {(inputs: Leadsdsrdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Log a data-subject request`;
  };

/**
 * | output |
 * | --- |
 * | "Log a data-subject request" |
 *
 * @param {Leadsdsrdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrdialogtitle3 =
  /** @type {((inputs?: Leadsdsrdialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrdialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrdialogtitle3(inputs);
      return vi_leadsdsrdialogtitle3(inputs);
    }
  );
export { leadsdsrdialogtitle3 as "leadsDsrDialogTitle" };
