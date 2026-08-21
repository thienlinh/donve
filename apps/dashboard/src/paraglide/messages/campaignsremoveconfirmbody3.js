/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsremoveconfirmbody3Inputs */

const vi_campaignsremoveconfirmbody3 =
  /** @type {(inputs: Campaignsremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Landing page gắn với chiến dịch này vẫn chạy bình thường, nhưng sẽ không còn hiển thị số liệu chiến dịch nữa.`;
  };

const en_campaignsremoveconfirmbody3 =
  /** @type {(inputs: Campaignsremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Landing pages attached to this campaign will keep running, but won't show campaign stats anymore.`;
  };

/**
 * | output |
 * | --- |
 * | "Landing pages attached to this campaign will keep running, but won't show campaign stats anymore." |
 *
 * @param {Campaignsremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsremoveconfirmbody3 =
  /** @type {((inputs?: Campaignsremoveconfirmbody3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsremoveconfirmbody3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsremoveconfirmbody3(inputs);
      return vi_campaignsremoveconfirmbody3(inputs);
    }
  );
export { campaignsremoveconfirmbody3 as "campaignsRemoveConfirmBody" };
