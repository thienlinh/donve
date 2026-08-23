/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rolesales1Inputs */

const vi_rolesales1 =
  /** @type {(inputs: Rolesales1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kinh doanh`;
  };

const en_rolesales1 =
  /** @type {(inputs: Rolesales1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sales`;
  };

/**
 * | output |
 * | --- |
 * | "Sales" |
 *
 * @param {Rolesales1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const rolesales1 =
  /** @type {((inputs?: Rolesales1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rolesales1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_rolesales1(inputs);
      return vi_rolesales1(inputs);
    }
  );
export { rolesales1 as "roleSales" };
