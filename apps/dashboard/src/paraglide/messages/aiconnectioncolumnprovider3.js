/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectioncolumnprovider3Inputs */

const vi_aiconnectioncolumnprovider3 =
  /** @type {(inputs: Aiconnectioncolumnprovider3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhà cung cấp`;
  };

const en_aiconnectioncolumnprovider3 =
  /** @type {(inputs: Aiconnectioncolumnprovider3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Provider`;
  };

/**
 * | output |
 * | --- |
 * | "Provider" |
 *
 * @param {Aiconnectioncolumnprovider3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectioncolumnprovider3 =
  /** @type {((inputs?: Aiconnectioncolumnprovider3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectioncolumnprovider3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectioncolumnprovider3(inputs);
      return vi_aiconnectioncolumnprovider3(inputs);
    }
  );
export { aiconnectioncolumnprovider3 as "aiConnectionColumnProvider" };
