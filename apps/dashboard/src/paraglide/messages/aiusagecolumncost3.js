/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiusagecolumncost3Inputs */

const vi_aiusagecolumncost3 =
  /** @type {(inputs: Aiusagecolumncost3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chi phí (credit)`;
  };

const en_aiusagecolumncost3 =
  /** @type {(inputs: Aiusagecolumncost3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cost (credits)`;
  };

/**
 * | output |
 * | --- |
 * | "Cost (credits)" |
 *
 * @param {Aiusagecolumncost3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiusagecolumncost3 =
  /** @type {((inputs?: Aiusagecolumncost3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiusagecolumncost3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiusagecolumncost3(inputs);
      return vi_aiusagecolumncost3(inputs);
    }
  );
export { aiusagecolumncost3 as "aiUsageColumnCost" };
