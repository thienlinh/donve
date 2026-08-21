/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ page: NonNullable<unknown>, total: NonNullable<unknown> }} Productspaginationlabel2Inputs */

const vi_productspaginationlabel2 =
  /** @type {(inputs: Productspaginationlabel2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Trang ${i?.page}/${i?.total}`;
  };

const en_productspaginationlabel2 =
  /** @type {(inputs: Productspaginationlabel2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Page ${i?.page} of ${i?.total}`;
  };

/**
 * | output |
 * | --- |
 * | "Page {page} of {total}" |
 *
 * @param {Productspaginationlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productspaginationlabel2 =
  /** @type {((inputs: Productspaginationlabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productspaginationlabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productspaginationlabel2(inputs);
      return vi_productspaginationlabel2(inputs);
    }
  );
export { productspaginationlabel2 as "productsPaginationLabel" };
