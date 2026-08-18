/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiusagedescription2Inputs */

const vi_aiusagedescription2 =
  /** @type {(inputs: Aiusagedescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Credit nền tảng và các lần tạo gần đây của tổ chức này.`;
  };

const en_aiusagedescription2 =
  /** @type {(inputs: Aiusagedescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Platform credits and recent generations for this organization.`;
  };

/**
 * | output |
 * | --- |
 * | "Platform credits and recent generations for this organization." |
 *
 * @param {Aiusagedescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiusagedescription2 =
  /** @type {((inputs?: Aiusagedescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiusagedescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiusagedescription2(inputs);
      return vi_aiusagedescription2(inputs);
    }
  );
export { aiusagedescription2 as "aiUsageDescription" };
