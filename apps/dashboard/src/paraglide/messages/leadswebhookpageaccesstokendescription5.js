/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookpageaccesstokendescription5Inputs */

const vi_leadswebhookpageaccesstokendescription5 =
  /** @type {(inputs: Leadswebhookpageaccesstokendescription5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bắt buộc để lấy dữ liệu form thật từ Facebook — webhook chỉ báo có lead mới (leadgen_id), phải dùng token này gọi lại Graph API mới lấy được tên/SĐT.`;
  };

const en_leadswebhookpageaccesstokendescription5 =
  /** @type {(inputs: Leadswebhookpageaccesstokendescription5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Required to fetch real form data from Facebook — the webhook only announces a new lead (leadgen_id), this token is what lets us call back into the Graph API for the name/phone.`;
  };

/**
 * | output |
 * | --- |
 * | "Required to fetch real form data from Facebook — the webhook only announces a new lead (leadgen_id), this token is what lets us call back into the Graph API ..." |
 *
 * @param {Leadswebhookpageaccesstokendescription5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookpageaccesstokendescription5 =
  /** @type {((inputs?: Leadswebhookpageaccesstokendescription5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookpageaccesstokendescription5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadswebhookpageaccesstokendescription5(inputs);
      return vi_leadswebhookpageaccesstokendescription5(inputs);
    }
  );
export { leadswebhookpageaccesstokendescription5 as "leadsWebhookPageAccessTokenDescription" };
