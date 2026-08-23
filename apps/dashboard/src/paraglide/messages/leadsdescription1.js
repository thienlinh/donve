/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdescription1Inputs */

const vi_leadsdescription1 =
  /** @type {(inputs: Leadsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Theo dõi, lọc và xử lý mọi lead từ các chiến dịch của bạn.`;
  };

const en_leadsdescription1 =
  /** @type {(inputs: Leadsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Track, filter, and work every lead your campaigns bring in.`;
  };

/**
 * | output |
 * | --- |
 * | "Track, filter, and work every lead your campaigns bring in." |
 *
 * @param {Leadsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdescription1 =
  /** @type {((inputs?: Leadsdescription1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdescription1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdescription1(inputs);
      return vi_leadsdescription1(inputs);
    }
  );
export { leadsdescription1 as "leadsDescription" };
