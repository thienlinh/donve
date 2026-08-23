/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsbulkdelete2Inputs */

const vi_leadsbulkdelete2 =
  /** @type {(inputs: Leadsbulkdelete2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá`;
  };

const en_leadsbulkdelete2 =
  /** @type {(inputs: Leadsbulkdelete2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Delete`;
  };

/**
 * | output |
 * | --- |
 * | "Delete" |
 *
 * @param {Leadsbulkdelete2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkdelete2 =
  /** @type {((inputs?: Leadsbulkdelete2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkdelete2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkdelete2(inputs);
      return vi_leadsbulkdelete2(inputs);
    }
  );
export { leadsbulkdelete2 as "leadsBulkDelete" };
