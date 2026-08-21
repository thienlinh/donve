/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Leadsdsrindicatorlabel3Inputs */

const vi_leadsdsrindicatorlabel3 =
  /** @type {(inputs: Leadsdsrindicatorlabel3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `${i?.count} yêu cầu dữ liệu cá nhân quá hạn hoặc sắp đến hạn`;
  };

const en_leadsdsrindicatorlabel3 =
  /** @type {(inputs: Leadsdsrindicatorlabel3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `${i?.count} data-subject request(s) overdue or due soon`;
  };

/**
 * | output |
 * | --- |
 * | "{count} data-subject request(s) overdue or due soon" |
 *
 * @param {Leadsdsrindicatorlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrindicatorlabel3 =
  /** @type {((inputs: Leadsdsrindicatorlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrindicatorlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrindicatorlabel3(inputs);
      return vi_leadsdsrindicatorlabel3(inputs);
    }
  );
export { leadsdsrindicatorlabel3 as "leadsDsrIndicatorLabel" };
