/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsformfieldsempty3Inputs */

const vi_campaignsformfieldsempty3 =
  /** @type {(inputs: Campaignsformfieldsempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang dùng các trường mặc định — thêm trường tuỳ chỉnh nếu cần.`;
  };

const en_campaignsformfieldsempty3 =
  /** @type {(inputs: Campaignsformfieldsempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Default lead-capture fields apply — add a custom field if you need more.`;
  };

/**
 * | output |
 * | --- |
 * | "Default lead-capture fields apply — add a custom field if you need more." |
 *
 * @param {Campaignsformfieldsempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsformfieldsempty3 =
  /** @type {((inputs?: Campaignsformfieldsempty3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsformfieldsempty3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsformfieldsempty3(inputs);
      return vi_campaignsformfieldsempty3(inputs);
    }
  );
export { campaignsformfieldsempty3 as "campaignsFormFieldsEmpty" };
