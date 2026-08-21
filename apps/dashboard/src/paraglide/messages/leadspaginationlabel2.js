/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ page: NonNullable<unknown>, total: NonNullable<unknown> }} Leadspaginationlabel2Inputs */

const vi_leadspaginationlabel2 =
  /** @type {(inputs: Leadspaginationlabel2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Trang ${i?.page}/${i?.total}`;
  };

const en_leadspaginationlabel2 =
  /** @type {(inputs: Leadspaginationlabel2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Page ${i?.page} of ${i?.total}`;
  };

/**
 * | output |
 * | --- |
 * | "Page {page} of {total}" |
 *
 * @param {Leadspaginationlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadspaginationlabel2 =
  /** @type {((inputs: Leadspaginationlabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadspaginationlabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadspaginationlabel2(inputs);
      return vi_leadspaginationlabel2(inputs);
    }
  );
export { leadspaginationlabel2 as "leadsPaginationLabel" };
