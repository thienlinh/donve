/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsbulkdeleteconfirmtitle4Inputs */

const vi_leadsbulkdeleteconfirmtitle4 =
  /** @type {(inputs: Leadsbulkdeleteconfirmtitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá lead đã chọn?`;
  };

const en_leadsbulkdeleteconfirmtitle4 =
  /** @type {(inputs: Leadsbulkdeleteconfirmtitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Delete selected leads?`;
  };

/**
 * | output |
 * | --- |
 * | "Delete selected leads?" |
 *
 * @param {Leadsbulkdeleteconfirmtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkdeleteconfirmtitle4 =
  /** @type {((inputs?: Leadsbulkdeleteconfirmtitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkdeleteconfirmtitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkdeleteconfirmtitle4(inputs);
      return vi_leadsbulkdeleteconfirmtitle4(inputs);
    }
  );
export { leadsbulkdeleteconfirmtitle4 as "leadsBulkDeleteConfirmTitle" };
