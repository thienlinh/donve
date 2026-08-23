/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectioncolumnstatus3Inputs */

const vi_aiconnectioncolumnstatus3 =
  /** @type {(inputs: Aiconnectioncolumnstatus3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trạng thái`;
  };

const en_aiconnectioncolumnstatus3 =
  /** @type {(inputs: Aiconnectioncolumnstatus3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Status`;
  };

/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Aiconnectioncolumnstatus3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectioncolumnstatus3 =
  /** @type {((inputs?: Aiconnectioncolumnstatus3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectioncolumnstatus3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectioncolumnstatus3(inputs);
      return vi_aiconnectioncolumnstatus3(inputs);
    }
  );
export { aiconnectioncolumnstatus3 as "aiConnectionColumnStatus" };
