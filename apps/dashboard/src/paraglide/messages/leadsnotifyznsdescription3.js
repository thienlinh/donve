/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyznsdescription3Inputs */

const vi_leadsnotifyznsdescription3 =
  /** @type {(inputs: Leadsnotifyznsdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `App Zalo ZNS của riêng bạn — dán access token lấy được qua OAuth của Zalo, và template ID đã được Zalo duyệt. Template phải dùng đúng tên trường lead_name, sla_hours, org_name.`;
  };

const en_leadsnotifyznsdescription3 =
  /** @type {(inputs: Leadsnotifyznsdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Your own Zalo ZNS app — paste the access token you obtained via Zalo's OAuth flow, and the template ID Zalo approved. Your template must use the field names lead_name, sla_hours, org_name.`;
  };

/**
 * | output |
 * | --- |
 * | "Your own Zalo ZNS app — paste the access token you obtained via Zalo's OAuth flow, and the template ID Zalo approved. Your template must use the field names ..." |
 *
 * @param {Leadsnotifyznsdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyznsdescription3 =
  /** @type {((inputs?: Leadsnotifyznsdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyznsdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyznsdescription3(inputs);
      return vi_leadsnotifyznsdescription3(inputs);
    }
  );
export { leadsnotifyznsdescription3 as "leadsNotifyZnsDescription" };
