/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectbutton2Inputs */

const vi_aiconnectbutton2 =
  /** @type {(inputs: Aiconnectbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối key`;
  };

const en_aiconnectbutton2 =
  /** @type {(inputs: Aiconnectbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect a key`;
  };

/**
 * | output |
 * | --- |
 * | "Connect a key" |
 *
 * @param {Aiconnectbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectbutton2 =
  /** @type {((inputs?: Aiconnectbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectbutton2(inputs);
      return vi_aiconnectbutton2(inputs);
    }
  );
export { aiconnectbutton2 as "aiConnectButton" };
