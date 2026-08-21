/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignstransferprefixlabel3Inputs */

const vi_campaignstransferprefixlabel3 =
  /** @type {(inputs: Campaignstransferprefixlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tiền tố nội dung chuyển khoản`;
  };

const en_campaignstransferprefixlabel3 =
  /** @type {(inputs: Campaignstransferprefixlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Transfer note prefix`;
  };

/**
 * | output |
 * | --- |
 * | "Transfer note prefix" |
 *
 * @param {Campaignstransferprefixlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignstransferprefixlabel3 =
  /** @type {((inputs?: Campaignstransferprefixlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignstransferprefixlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignstransferprefixlabel3(inputs);
      return vi_campaignstransferprefixlabel3(inputs);
    }
  );
export { campaignstransferprefixlabel3 as "campaignsTransferPrefixLabel" };
