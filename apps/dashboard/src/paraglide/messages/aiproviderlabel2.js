/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiproviderlabel2Inputs */

const vi_aiproviderlabel2 =
  /** @type {(inputs: Aiproviderlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhà cung cấp`;
  };

const en_aiproviderlabel2 =
  /** @type {(inputs: Aiproviderlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Provider`;
  };

/**
 * | output |
 * | --- |
 * | "Provider" |
 *
 * @param {Aiproviderlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiproviderlabel2 =
  /** @type {((inputs?: Aiproviderlabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiproviderlabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiproviderlabel2(inputs);
      return vi_aiproviderlabel2(inputs);
    }
  );
export { aiproviderlabel2 as "aiProviderLabel" };
