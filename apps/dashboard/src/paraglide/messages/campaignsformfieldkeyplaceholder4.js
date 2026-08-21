/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsformfieldkeyplaceholder4Inputs */

const vi_campaignsformfieldkeyplaceholder4 =
  /** @type {(inputs: Campaignsformfieldkeyplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mã trường`;
  };

const en_campaignsformfieldkeyplaceholder4 =
  /** @type {(inputs: Campaignsformfieldkeyplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Field key`;
  };

/**
 * | output |
 * | --- |
 * | "Field key" |
 *
 * @param {Campaignsformfieldkeyplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsformfieldkeyplaceholder4 =
  /** @type {((inputs?: Campaignsformfieldkeyplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsformfieldkeyplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsformfieldkeyplaceholder4(inputs);
      return vi_campaignsformfieldkeyplaceholder4(inputs);
    }
  );
export { campaignsformfieldkeyplaceholder4 as "campaignsFormFieldKeyPlaceholder" };
