/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectdialogtitle3Inputs */

const vi_aiconnectdialogtitle3 =
  /** @type {(inputs: Aiconnectdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối API key`;
  };

const en_aiconnectdialogtitle3 =
  /** @type {(inputs: Aiconnectdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect an API key`;
  };

/**
 * | output |
 * | --- |
 * | "Connect an API key" |
 *
 * @param {Aiconnectdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectdialogtitle3 =
  /** @type {((inputs?: Aiconnectdialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectdialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectdialogtitle3(inputs);
      return vi_aiconnectdialogtitle3(inputs);
    }
  );
export { aiconnectdialogtitle3 as "aiConnectDialogTitle" };
