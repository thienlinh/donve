/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsbulkexport2Inputs */

const vi_leadsbulkexport2 =
  /** @type {(inputs: Leadsbulkexport2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xuất CSV`;
  };

const en_leadsbulkexport2 =
  /** @type {(inputs: Leadsbulkexport2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Export CSV`;
  };

/**
 * | output |
 * | --- |
 * | "Export CSV" |
 *
 * @param {Leadsbulkexport2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkexport2 =
  /** @type {((inputs?: Leadsbulkexport2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkexport2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkexport2(inputs);
      return vi_leadsbulkexport2(inputs);
    }
  );
export { leadsbulkexport2 as "leadsBulkExport" };
