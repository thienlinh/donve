/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiogenerateerrorbuycreditsbutton5Inputs */

const vi_studiogenerateerrorbuycreditsbutton5 =
  /** @type {(inputs: Studiogenerateerrorbuycreditsbutton5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mua thêm credit`;
  };

const en_studiogenerateerrorbuycreditsbutton5 =
  /** @type {(inputs: Studiogenerateerrorbuycreditsbutton5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Buy more credits`;
  };

/**
 * | output |
 * | --- |
 * | "Buy more credits" |
 *
 * @param {Studiogenerateerrorbuycreditsbutton5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiogenerateerrorbuycreditsbutton5 =
  /** @type {((inputs?: Studiogenerateerrorbuycreditsbutton5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiogenerateerrorbuycreditsbutton5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_studiogenerateerrorbuycreditsbutton5(inputs);
      return vi_studiogenerateerrorbuycreditsbutton5(inputs);
    }
  );
export { studiogenerateerrorbuycreditsbutton5 as "studioGenerateErrorBuyCreditsButton" };
