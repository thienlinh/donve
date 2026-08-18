/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roleowner1Inputs */

const vi_roleowner1 =
  /** @type {(inputs: Roleowner1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chủ sở hữu`;
  };

const en_roleowner1 =
  /** @type {(inputs: Roleowner1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Owner`;
  };

/**
 * | output |
 * | --- |
 * | "Owner" |
 *
 * @param {Roleowner1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const roleowner1 =
  /** @type {((inputs?: Roleowner1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roleowner1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_roleowner1(inputs);
      return vi_roleowner1(inputs);
    }
  );
export { roleowner1 as "roleOwner" };
