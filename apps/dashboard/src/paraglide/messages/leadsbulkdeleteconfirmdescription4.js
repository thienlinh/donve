/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Leadsbulkdeleteconfirmdescription4Inputs */

const vi_leadsbulkdeleteconfirmdescription4 =
  /** @type {(inputs: Leadsbulkdeleteconfirmdescription4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Hành động này sẽ xoá ${i?.count} lead và không thể hoàn tác.`;
  };

const en_leadsbulkdeleteconfirmdescription4 =
  /** @type {(inputs: Leadsbulkdeleteconfirmdescription4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `This will permanently delete ${i?.count} lead(s).`;
  };

/**
 * | output |
 * | --- |
 * | "This will permanently delete {count} lead(s)." |
 *
 * @param {Leadsbulkdeleteconfirmdescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkdeleteconfirmdescription4 =
  /** @type {((inputs: Leadsbulkdeleteconfirmdescription4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkdeleteconfirmdescription4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkdeleteconfirmdescription4(inputs);
      return vi_leadsbulkdeleteconfirmdescription4(inputs);
    }
  );
export { leadsbulkdeleteconfirmdescription4 as "leadsBulkDeleteConfirmDescription" };
