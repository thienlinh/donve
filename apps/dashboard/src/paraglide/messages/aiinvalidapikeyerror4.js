/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiinvalidapikeyerror4Inputs */

const vi_aiinvalidapikeyerror4 =
  /** @type {(inputs: Aiinvalidapikeyerror4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể xác thực key này với nhà cung cấp.`;
  };

const en_aiinvalidapikeyerror4 =
  /** @type {(inputs: Aiinvalidapikeyerror4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `That key couldn't be validated with the provider.`;
  };

/**
 * | output |
 * | --- |
 * | "That key couldn't be validated with the provider." |
 *
 * @param {Aiinvalidapikeyerror4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiinvalidapikeyerror4 =
  /** @type {((inputs?: Aiinvalidapikeyerror4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiinvalidapikeyerror4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiinvalidapikeyerror4(inputs);
      return vi_aiinvalidapikeyerror4(inputs);
    }
  );
export { aiinvalidapikeyerror4 as "aiInvalidApiKeyError" };
