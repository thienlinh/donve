/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsuploadevidencebutton4Inputs */

const vi_refundrequestsuploadevidencebutton4 =
  /** @type {(inputs: Refundrequestsuploadevidencebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tải ảnh biên lai chuyển khoản`;
  };

const en_refundrequestsuploadevidencebutton4 =
  /** @type {(inputs: Refundrequestsuploadevidencebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Upload receipt photo`;
  };

/**
 * | output |
 * | --- |
 * | "Upload receipt photo" |
 *
 * @param {Refundrequestsuploadevidencebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsuploadevidencebutton4 =
  /** @type {((inputs?: Refundrequestsuploadevidencebutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsuploadevidencebutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_refundrequestsuploadevidencebutton4(inputs);
      return vi_refundrequestsuploadevidencebutton4(inputs);
    }
  );
export { refundrequestsuploadevidencebutton4 as "refundRequestsUploadEvidenceButton" };
