/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsbulkdeleteconfirm3Inputs */

const vi_leadsbulkdeleteconfirm3 =
  /** @type {(inputs: Leadsbulkdeleteconfirm3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá`;
  };

const en_leadsbulkdeleteconfirm3 =
  /** @type {(inputs: Leadsbulkdeleteconfirm3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Delete`;
  };

/**
 * | output |
 * | --- |
 * | "Delete" |
 *
 * @param {Leadsbulkdeleteconfirm3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkdeleteconfirm3 =
  /** @type {((inputs?: Leadsbulkdeleteconfirm3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkdeleteconfirm3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkdeleteconfirm3(inputs);
      return vi_leadsbulkdeleteconfirm3(inputs);
    }
  );
export { leadsbulkdeleteconfirm3 as "leadsBulkDeleteConfirm" };
