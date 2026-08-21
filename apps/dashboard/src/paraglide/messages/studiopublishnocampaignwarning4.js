/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishnocampaignwarning4Inputs */

const vi_studiopublishnocampaignwarning4 =
  /** @type {(inputs: Studiopublishnocampaignwarning4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trang này có form đăng ký nhưng chưa được gắn vào campaign nào. Nếu không có campaign, form sẽ không có trường dữ liệu, không có cấu hình thanh toán, và không biết gửi dữ liệu vào đâu. Hãy gắn một campaign ngay, hoặc xuất bản luôn nếu trang này thực sự không cần campaign.`;
  };

const en_studiopublishnocampaignwarning4 =
  /** @type {(inputs: Studiopublishnocampaignwarning4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `This page has a signup form, but isn't linked to a campaign yet. Without one, the form has no fields, no payment setup, and nothing to submit into. Attach a campaign now, or publish anyway if this page really doesn't need one.`;
  };

/**
 * | output |
 * | --- |
 * | "This page has a signup form, but isn't linked to a campaign yet. Without one, the form has no fields, no payment setup, and nothing to submit into. Attach a ..." |
 *
 * @param {Studiopublishnocampaignwarning4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishnocampaignwarning4 =
  /** @type {((inputs?: Studiopublishnocampaignwarning4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishnocampaignwarning4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopublishnocampaignwarning4(inputs);
      return vi_studiopublishnocampaignwarning4(inputs);
    }
  );
export { studiopublishnocampaignwarning4 as "studioPublishNoCampaignWarning" };
