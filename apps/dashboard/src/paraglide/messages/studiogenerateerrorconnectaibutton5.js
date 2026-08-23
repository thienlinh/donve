/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiogenerateerrorconnectaibutton5Inputs */

const vi_studiogenerateerrorconnectaibutton5 =
  /** @type {(inputs: Studiogenerateerrorconnectaibutton5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối AI`;
  };

const en_studiogenerateerrorconnectaibutton5 =
  /** @type {(inputs: Studiogenerateerrorconnectaibutton5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect AI`;
  };

/**
 * | output |
 * | --- |
 * | "Connect AI" |
 *
 * @param {Studiogenerateerrorconnectaibutton5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiogenerateerrorconnectaibutton5 =
  /** @type {((inputs?: Studiogenerateerrorconnectaibutton5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiogenerateerrorconnectaibutton5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_studiogenerateerrorconnectaibutton5(inputs);
      return vi_studiogenerateerrorconnectaibutton5(inputs);
    }
  );
export { studiogenerateerrorconnectaibutton5 as "studioGenerateErrorConnectAiButton" };
