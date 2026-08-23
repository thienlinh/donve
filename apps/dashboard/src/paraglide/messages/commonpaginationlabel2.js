/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ page: NonNullable<unknown>, total: NonNullable<unknown> }} Commonpaginationlabel2Inputs */

const vi_commonpaginationlabel2 =
  /** @type {(inputs: Commonpaginationlabel2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Trang ${i?.page}/${i?.total}`;
  };

const en_commonpaginationlabel2 =
  /** @type {(inputs: Commonpaginationlabel2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Page ${i?.page} of ${i?.total}`;
  };

/**
 * | output |
 * | --- |
 * | "Page {page} of {total}" |
 *
 * @param {Commonpaginationlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commonpaginationlabel2 =
  /** @type {((inputs: Commonpaginationlabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commonpaginationlabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commonpaginationlabel2(inputs);
      return vi_commonpaginationlabel2(inputs);
    }
  );
export { commonpaginationlabel2 as "commonPaginationLabel" };
