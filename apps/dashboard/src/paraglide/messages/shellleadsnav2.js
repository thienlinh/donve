/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellleadsnav2Inputs */

const vi_shellleadsnav2 =
  /** @type {(inputs: Shellleadsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khách hàng tiềm năng`;
  };

const en_shellleadsnav2 =
  /** @type {(inputs: Shellleadsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Leads`;
  };

/**
 * | output |
 * | --- |
 * | "Leads" |
 *
 * @param {Shellleadsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellleadsnav2 =
  /** @type {((inputs?: Shellleadsnav2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellleadsnav2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellleadsnav2(inputs);
      return vi_shellleadsnav2(inputs);
    }
  );
export { shellleadsnav2 as "shellLeadsNav" };
