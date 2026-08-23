/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsuploaderrortoast4Inputs */

const vi_refundrequestsuploaderrortoast4 =
  /** @type {(inputs: Refundrequestsuploaderrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải lên được ảnh biên lai. Vui lòng thử lại.`;
  };

const en_refundrequestsuploaderrortoast4 =
  /** @type {(inputs: Refundrequestsuploaderrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't upload the receipt photo. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't upload the receipt photo. Try again." |
 *
 * @param {Refundrequestsuploaderrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsuploaderrortoast4 =
  /** @type {((inputs?: Refundrequestsuploaderrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsuploaderrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsuploaderrortoast4(inputs);
      return vi_refundrequestsuploaderrortoast4(inputs);
    }
  );
export { refundrequestsuploaderrortoast4 as "refundRequestsUploadErrorToast" };
