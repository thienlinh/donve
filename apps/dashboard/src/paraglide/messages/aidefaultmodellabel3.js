/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aidefaultmodellabel3Inputs */

const vi_aidefaultmodellabel3 =
  /** @type {(inputs: Aidefaultmodellabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Model mặc định`;
  };

const en_aidefaultmodellabel3 =
  /** @type {(inputs: Aidefaultmodellabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Default model`;
  };

/**
 * | output |
 * | --- |
 * | "Default model" |
 *
 * @param {Aidefaultmodellabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aidefaultmodellabel3 =
  /** @type {((inputs?: Aidefaultmodellabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aidefaultmodellabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aidefaultmodellabel3(inputs);
      return vi_aidefaultmodellabel3(inputs);
    }
  );
export { aidefaultmodellabel3 as "aiDefaultModelLabel" };
