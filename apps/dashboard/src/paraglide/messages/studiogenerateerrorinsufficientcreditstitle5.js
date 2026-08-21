/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiogenerateerrorinsufficientcreditstitle5Inputs */

const vi_studiogenerateerrorinsufficientcreditstitle5 =
  /** @type {(inputs: Studiogenerateerrorinsufficientcreditstitle5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không đủ credit`;
  };

const en_studiogenerateerrorinsufficientcreditstitle5 =
  /** @type {(inputs: Studiogenerateerrorinsufficientcreditstitle5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Not enough credits`;
  };

/**
 * | output |
 * | --- |
 * | "Not enough credits" |
 *
 * @param {Studiogenerateerrorinsufficientcreditstitle5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiogenerateerrorinsufficientcreditstitle5 =
  /** @type {((inputs?: Studiogenerateerrorinsufficientcreditstitle5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiogenerateerrorinsufficientcreditstitle5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_studiogenerateerrorinsufficientcreditstitle5(inputs);
      return vi_studiogenerateerrorinsufficientcreditstitle5(inputs);
    }
  );
export { studiogenerateerrorinsufficientcreditstitle5 as "studioGenerateErrorInsufficientCreditsTitle" };
