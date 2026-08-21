/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Memberscolumnseeallleads4Inputs */

const vi_memberscolumnseeallleads4 =
  /** @type {(inputs: Memberscolumnseeallleads4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xem tất cả lead`;
  };

const en_memberscolumnseeallleads4 =
  /** @type {(inputs: Memberscolumnseeallleads4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `See all leads`;
  };

/**
 * | output |
 * | --- |
 * | "See all leads" |
 *
 * @param {Memberscolumnseeallleads4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberscolumnseeallleads4 =
  /** @type {((inputs?: Memberscolumnseeallleads4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberscolumnseeallleads4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberscolumnseeallleads4(inputs);
      return vi_memberscolumnseeallleads4(inputs);
    }
  );
export { memberscolumnseeallleads4 as "membersColumnSeeAllLeads" };
