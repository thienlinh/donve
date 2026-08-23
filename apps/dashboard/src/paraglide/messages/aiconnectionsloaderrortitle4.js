/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectionsloaderrortitle4Inputs */

const vi_aiconnectionsloaderrortitle4 =
  /** @type {(inputs: Aiconnectionsloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được kết nối AI`;
  };

const en_aiconnectionsloaderrortitle4 =
  /** @type {(inputs: Aiconnectionsloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load AI connections`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load AI connections" |
 *
 * @param {Aiconnectionsloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectionsloaderrortitle4 =
  /** @type {((inputs?: Aiconnectionsloaderrortitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectionsloaderrortitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectionsloaderrortitle4(inputs);
      return vi_aiconnectionsloaderrortitle4(inputs);
    }
  );
export { aiconnectionsloaderrortitle4 as "aiConnectionsLoadErrorTitle" };
