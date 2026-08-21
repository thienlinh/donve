/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Campaignsremoveconfirmtitle3Inputs */

const vi_campaignsremoveconfirmtitle3 =
  /** @type {(inputs: Campaignsremoveconfirmtitle3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Xoá ${i?.name}?`;
  };

const en_campaignsremoveconfirmtitle3 =
  /** @type {(inputs: Campaignsremoveconfirmtitle3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Remove ${i?.name}?`;
  };

/**
 * | output |
 * | --- |
 * | "Remove {name}?" |
 *
 * @param {Campaignsremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsremoveconfirmtitle3 =
  /** @type {((inputs: Campaignsremoveconfirmtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsremoveconfirmtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsremoveconfirmtitle3(inputs);
      return vi_campaignsremoveconfirmtitle3(inputs);
    }
  );
export { campaignsremoveconfirmtitle3 as "campaignsRemoveConfirmTitle" };
