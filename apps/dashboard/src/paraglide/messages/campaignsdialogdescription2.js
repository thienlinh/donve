/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsdialogdescription2Inputs */

const vi_campaignsdialogdescription2 =
  /** @type {(inputs: Campaignsdialogdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gắn sản phẩm, đặt khoảng thời gian và cấu hình thanh toán.`;
  };

const en_campaignsdialogdescription2 =
  /** @type {(inputs: Campaignsdialogdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Attach products, set a date range, and configure payment.`;
  };

/**
 * | output |
 * | --- |
 * | "Attach products, set a date range, and configure payment." |
 *
 * @param {Campaignsdialogdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsdialogdescription2 =
  /** @type {((inputs?: Campaignsdialogdescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsdialogdescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsdialogdescription2(inputs);
      return vi_campaignsdialogdescription2(inputs);
    }
  );
export { campaignsdialogdescription2 as "campaignsDialogDescription" };
