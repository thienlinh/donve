/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsformfieldoptionsplaceholder4Inputs */

const vi_campaignsformfieldoptionsplaceholder4 =
  /** @type {(inputs: Campaignsformfieldoptionsplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Các lựa chọn, phân tách bằng dấu phẩy`;
  };

const en_campaignsformfieldoptionsplaceholder4 =
  /** @type {(inputs: Campaignsformfieldoptionsplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Options, comma-separated`;
  };

/**
 * | output |
 * | --- |
 * | "Options, comma-separated" |
 *
 * @param {Campaignsformfieldoptionsplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsformfieldoptionsplaceholder4 =
  /** @type {((inputs?: Campaignsformfieldoptionsplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsformfieldoptionsplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_campaignsformfieldoptionsplaceholder4(inputs);
      return vi_campaignsformfieldoptionsplaceholder4(inputs);
    }
  );
export { campaignsformfieldoptionsplaceholder4 as "campaignsFormFieldOptionsPlaceholder" };
