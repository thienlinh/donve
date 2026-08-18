/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectsubmit2Inputs */

const vi_aiconnectsubmit2 =
  /** @type {(inputs: Aiconnectsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối`;
  };

const en_aiconnectsubmit2 =
  /** @type {(inputs: Aiconnectsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect`;
  };

/**
 * | output |
 * | --- |
 * | "Connect" |
 *
 * @param {Aiconnectsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectsubmit2 =
  /** @type {((inputs?: Aiconnectsubmit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectsubmit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectsubmit2(inputs);
      return vi_aiconnectsubmit2(inputs);
    }
  );
export { aiconnectsubmit2 as "aiConnectSubmit" };
