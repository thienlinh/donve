/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shelldomainsnav2Inputs */

const vi_shelldomainsnav2 =
  /** @type {(inputs: Shelldomainsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên miền`;
  };

const en_shelldomainsnav2 =
  /** @type {(inputs: Shelldomainsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Domains`;
  };

/**
 * | output |
 * | --- |
 * | "Domains" |
 *
 * @param {Shelldomainsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shelldomainsnav2 =
  /** @type {((inputs?: Shelldomainsnav2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shelldomainsnav2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shelldomainsnav2(inputs);
      return vi_shelldomainsnav2(inputs);
    }
  );
export { shelldomainsnav2 as "shellDomainsNav" };
