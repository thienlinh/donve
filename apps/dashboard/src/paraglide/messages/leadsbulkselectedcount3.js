/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Leadsbulkselectedcount3Inputs */

const vi_leadsbulkselectedcount3 =
  /** @type {(inputs: Leadsbulkselectedcount3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Đã chọn ${i?.count} lead`;
  };

const en_leadsbulkselectedcount3 =
  /** @type {(inputs: Leadsbulkselectedcount3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `${i?.count} lead(s) selected`;
  };

/**
 * | output |
 * | --- |
 * | "{count} lead(s) selected" |
 *
 * @param {Leadsbulkselectedcount3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkselectedcount3 =
  /** @type {((inputs: Leadsbulkselectedcount3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkselectedcount3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkselectedcount3(inputs);
      return vi_leadsbulkselectedcount3(inputs);
    }
  );
export { leadsbulkselectedcount3 as "leadsBulkSelectedCount" };
