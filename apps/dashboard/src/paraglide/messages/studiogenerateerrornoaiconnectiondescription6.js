/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiogenerateerrornoaiconnectiondescription6Inputs */

const vi_studiogenerateerrornoaiconnectiondescription6 =
  /** @type {(inputs: Studiogenerateerrornoaiconnectiondescription6Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối một API key để tạo trang này.`;
  };

const en_studiogenerateerrornoaiconnectiondescription6 =
  /** @type {(inputs: Studiogenerateerrornoaiconnectiondescription6Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect an API key to generate this page.`;
  };

/**
 * | output |
 * | --- |
 * | "Connect an API key to generate this page." |
 *
 * @param {Studiogenerateerrornoaiconnectiondescription6Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiogenerateerrornoaiconnectiondescription6 =
  /** @type {((inputs?: Studiogenerateerrornoaiconnectiondescription6Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiogenerateerrornoaiconnectiondescription6Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_studiogenerateerrornoaiconnectiondescription6(inputs);
      return vi_studiogenerateerrornoaiconnectiondescription6(inputs);
    }
  );
export { studiogenerateerrornoaiconnectiondescription6 as "studioGenerateErrorNoAiConnectionDescription" };
