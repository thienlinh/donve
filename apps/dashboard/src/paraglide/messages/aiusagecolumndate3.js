/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiusagecolumndate3Inputs */

const vi_aiusagecolumndate3 =
  /** @type {(inputs: Aiusagecolumndate3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ngày`;
  };

const en_aiusagecolumndate3 =
  /** @type {(inputs: Aiusagecolumndate3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Date`;
  };

/**
 * | output |
 * | --- |
 * | "Date" |
 *
 * @param {Aiusagecolumndate3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiusagecolumndate3 =
  /** @type {((inputs?: Aiusagecolumndate3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiusagecolumndate3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiusagecolumndate3(inputs);
      return vi_aiusagecolumndate3(inputs);
    }
  );
export { aiusagecolumndate3 as "aiUsageColumnDate" };
