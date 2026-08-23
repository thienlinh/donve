/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiusagetitle2Inputs */

const vi_aiusagetitle2 =
  /** @type {(inputs: Aiusagetitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sử dụng`;
  };

const en_aiusagetitle2 =
  /** @type {(inputs: Aiusagetitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Usage`;
  };

/**
 * | output |
 * | --- |
 * | "Usage" |
 *
 * @param {Aiusagetitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiusagetitle2 =
  /** @type {((inputs?: Aiusagetitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiusagetitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiusagetitle2(inputs);
      return vi_aiusagetitle2(inputs);
    }
  );
export { aiusagetitle2 as "aiUsageTitle" };
